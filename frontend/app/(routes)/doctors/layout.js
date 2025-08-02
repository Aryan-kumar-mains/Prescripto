// layout.js is reserved keyword in next.js to design the layout.

import React from 'react'
import CategoryList from './_components/CategoryList';

const Layout = ({ children }) => {
  return (
    <div className='grid grid-cols-4'>
        {/* Category of Speciality of Doctors */}
        <div className='hidden md:block' >
          <CategoryList />
        </div>
        <div className='col-span-3'>
            {children}
        </div>
        
    </div>
  )
}

export default Layout;