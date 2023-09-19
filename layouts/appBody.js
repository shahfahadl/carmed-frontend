import React, { useMemo } from 'react'
import styled from "styled-components"
import { useRouter } from 'next/router'

const Body = styled.div`
    width: calc(100% - 280px);
    margin-left: 280px;
    height: 100vh;
`

export default function AppBody({children}) {

    const {
        pathname
    } = useRouter();

    const isApp = useMemo(() => pathname.indexOf('/app') > -1 , [pathname])

  return isApp? <Body>{children}</Body> : <div>{children}</div> 
}
