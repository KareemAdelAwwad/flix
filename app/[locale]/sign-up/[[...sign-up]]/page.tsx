import { SignUp } from "@clerk/nextjs"

export default function page() {
  return (
    <div className='flex justify-center'>
      <SignUp />
    </div>
  )
}
