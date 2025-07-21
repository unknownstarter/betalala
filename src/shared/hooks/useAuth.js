import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseAdmin } from '../../infrastructure/supabase/SupabaseClient.js';
import { User } from '../../core/entities/User.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserWithRole = useCallback(async (authUser) => {
    if (!authUser) return null;

    try {
      // user_profile 테이블에서 role 정보 가져오기
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      // 프로필이 없으면 자동 생성
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Profile not found, creating new profile for user:', authUser.email);
        
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: authUser.id,
                email: authUser.email,
                role: 'user'
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            // 프로필 생성 실패해도 기본 사용자 정보는 반환
            return User.fromJson({
              id: authUser.id,
              email: authUser.email,
              role: 'user'
            });
          }

          console.log('New profile created:', newProfile);
          return User.fromJson({
            id: authUser.id,
            email: authUser.email,
            role: newProfile.role
          });
        } catch (error) {
          console.error('Profile creation failed:', error);
          // 프로필 생성 실패해도 기본 사용자 정보는 반환
          return User.fromJson({
            id: authUser.id,
            email: authUser.email,
            role: 'user'
          });
        }
      }

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
      }

      // auth user 정보와 profile 정보를 결합
      const userData = {
        id: authUser.id,
        email: authUser.email,
        role: profile?.role || 'user'
      };

      return User.fromJson(userData);
    } catch (error) {
      console.error('Error getting user with role:', error);
      // 기본 사용자 정보라도 반환
      return User.fromJson({
        id: authUser.id,
        email: authUser.email,
        role: 'user'
      });
    }
  }, []);

  useEffect(() => {
    // 환경변수 확인 - 즉시 체크
    const hasSupabaseConfig = process.env.REACT_APP_SUPABASE_URL && 
                             process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    console.log('Supabase config check:', {
      url: process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set',
      anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      serviceKey: process.env.REACT_APP_SUPABASE_API_KEY ? 'Set' : 'Not set'
    });

    // 환경변수가 없으면 더미 사용자로 바로 설정하고 종료
    if (!hasSupabaseConfig) {
      console.log('Using dummy admin user for testing - no Supabase config');
      const dummyUser = User.fromJson({
        id: 'dummy-admin-id',
        email: 'admin@test.com',
        role: 'admin'
      });
      console.log('Dummy user created:', dummyUser);
      console.log('Is admin?', dummyUser.isAdmin);
      console.log('Setting user and loading to false');
      setUser(dummyUser);
      setLoading(false);
      return;
    }

    // 실제 Supabase 연결이 있는 경우에만 구독 설정
    let subscription;

    const setupAuth = async () => {
      try {
        console.log('Using real Supabase connection');
        
        // 초기 사용자 상태 확인
        const { data: { user: initialUser } } = await supabase.auth.getUser();
        
        if (initialUser) {
          console.log('Initial user found:', initialUser);
          const userWithRole = await getUserWithRole(initialUser);
          console.log('User with role:', userWithRole);
          setUser(userWithRole);
        } else {
          console.log('No initial user found');
        }

        // 인증 상태 변경 구독
        const { data: { subscription: authSubscription } } = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            if (session?.user) {
              const userWithRole = await getUserWithRole(session.user);
              setUser(userWithRole);
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        );

        subscription = authSubscription;
        setLoading(false);
      } catch (error) {
        console.error('Auth setup error:', error);
        // 에러가 발생해도 더미 사용자로 테스트 가능
        console.log('Using dummy admin user due to auth error');
        setUser(User.fromJson({
          id: 'dummy-admin-id',
          email: 'admin@test.com',
          role: 'admin'
        }));
        setLoading(false);
      }
    };

    setupAuth();

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth:', error);
        }
      }
    };
  }, [getUserWithRole]);

  const signIn = async (email, password) => {
    try {
      // 환경변수 확인
      const hasSupabaseConfig = process.env.REACT_APP_SUPABASE_URL && 
                               process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      // 환경변수가 없으면 더미 로그인 성공
      if (!hasSupabaseConfig) {
        console.log('Dummy login successful - no Supabase config');
        setUser(User.fromJson({
          id: 'dummy-admin-id',
          email: email,
          role: 'admin'
        }));
        return { success: true };
      }

      console.log('Attempting real Supabase login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Supabase login successful:', data.user.email);
        const userWithRole = await getUserWithRole(data.user);
        console.log('User with role after login:', userWithRole);
        setUser(userWithRole);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    console.log('signOut function called');
    try {
      // 환경변수 확인
      const hasSupabaseConfig = process.env.REACT_APP_SUPABASE_URL && 
                               process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      console.log('Supabase config for logout:', {
        url: process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set',
        anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      });

      // 환경변수가 없으면 더미 로그아웃
      if (!hasSupabaseConfig) {
        console.log('Dummy logout - no Supabase config');
        setUser(null); // 즉시 사용자 상태 업데이트
        return { success: true };
      }

      console.log('Attempting real Supabase logout');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
        throw error;
      }

      console.log('Supabase logout successful');
      setUser(null); // 즉시 사용자 상태 업데이트
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut
  };
}; 