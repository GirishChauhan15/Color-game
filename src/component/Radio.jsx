import React, { useId } from 'react'

function Radio({labelInfo, ...props }) {
    const id = useId()
  return (
    <div className='flex my-4 text-xs font-semibold xsm:font-extrabold font-lato xsm:text-sm sm:text-lg lg:text-xl'>
        <input type="radio" name='levels' value={labelInfo} id={id} {...props} className='xsm:w-4 sm:w-6 lg:w-8' />
    <label htmlFor={id} className='ml-2 mr-4 xsm:mr-6 '>
        {labelInfo}
    </label>
    </div>
  )
}

export default Radio