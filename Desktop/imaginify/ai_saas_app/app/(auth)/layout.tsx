
// done 
import React from 'react'
// ReactNode is a type that represents a React element, an array of React elements, or a string, number, or boolean.
 // It is defined in the react module and can be used to specify the type of a variable that can hold any of these types.
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth">{children}</main>
  )
}

export default Layout;