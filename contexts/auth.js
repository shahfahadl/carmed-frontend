import UserService from '@utility/services/user';
import React, {
    createContext, useState, useContext, useEffect, useMemo,
} from 'react'

import { useRouter } from 'next/router'

const AuthContext = createContext();

/*
shahfahadiffi+admin@gmail.com
admin1234
*/

export function AuthProvider({ children }) {
    const {
        replace, pathname, events
    } = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isVendor, setIsVendor] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    const setData = (preUser = null) => {
        if (window.top === window.self) {
            const authenticated = UserService.isAuthenticated();
            setIsAuthenticated(authenticated);
            if (authenticated) {
                const user = UserService.getUser();
                setIsAdmin(user?.type === 'admin')
                setUser(user);
                setIsVendor(user?.type === 'vendor')
            }
        }
    }

    useEffect(() => {
        const handleRouteChange = (url) => {
            if(!loading){
                if (url.indexOf('/login') < 0 && url.indexOf('/app') > -1 && !isAuthenticated && !loading) {
                    replace('/login');
                } else if (url.indexOf('/login') > -1 && isAuthenticated){
                    if(isVendor){
                        replace('/app/vendor');
                    } else if(isAdmin){
                      replace('/app/admin')
                    } else {
                        replace('/app')
                    }
                } else if(isAuthenticated){
                    if(isVendor){
                        if(url.indexOf('/vendor') < 0 && url.indexOf('/app') > -1){
                            replace('/app/vendor')
                        }
                    } else if(isAdmin && url.indexOf('/admin') < 0 && url.indexOf('/app') > -1 ){
                      replace('/app/admin')
                    } else if(url.indexOf('/vendor') > -1 && url.indexOf('/app') > -1){
                        replace('/app')
                    }
                }
            }
        }

        handleRouteChange(pathname)

        events.on('routeChangeStart', handleRouteChange)
        return () => {
            events.off('routeChangeStart', handleRouteChange)
        }
    }, [isAuthenticated, loading, isVendor])

    useEffect(() => {
        const loadToken = async () => {
            setData();
            setLoading(false)
        }
        loadToken()
    }, [])

    const logout = () => {
        UserService.logout();
        setIsAuthenticated(false)
    }

    const login = () => {
        setData();
      }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout,
            isVendor,
            isAdmin
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)