import React from 'react'

const Hero = () => {
  return (
    <div className='min-h-screen bg-base-100 py-12'>
        <div className='w-full flex items-center justify-center text-primary text-5xl font-semibold underline decoration-4 underline-offset-8 decoration-secondary font-[Poppins]'>
            TimeVault
        </div>

        <div className='py-24 flex items-center justify-center'>
            <div className='h-100 w-100 rounded-full bg-accent relative max-md:*:hidden'>
                <div className='absolute -top-7 -left-20 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>
                <div className='absolute top-23 -left-40 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>
                <div className='absolute top-51 -left-40 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>
                <div className='absolute top-80 -left-25 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>

                <div className='absolute -top-7 -right-20 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>
                <div className='absolute top-23 -right-40 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>
                <div className='absolute top-51 -right-40 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>
                <div className='absolute top-80 -right-25 bg-base-300 border-accent border-2 p-4 rounded-2xl'>
                    <div className='text-primary'>Event Name</div>
                    <div className='text-secondary'>Description</div>
                </div>
            </div>
            {/* <div className=''>
                
            </div> */}
        </div>

        <div className='w-full flex items-center justify-center flex-wrap gap-4 md:hidden'>
            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>
            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>
            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>
            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>

            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>
            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>
            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>
            <div className='bg-base-300 border-accent border-2 p-4 rounded-2xl h-40 w-70 grid place-content-center'>
                <div className='text-primary'>Event Name</div>
                <div className='text-secondary'>Description</div>
            </div>
        </div>
    </div>
  )
}

export default Hero