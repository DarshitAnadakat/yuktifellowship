import { Link } from "react-router-dom"
import { BoltIcon } from "../components/Icons"

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-[#e8f5e9]">
      <div className="flex flex-col items-center mb-5">
        <div className="text-3xl font-bold flex items-center">
          <BoltIcon className="mr-1" />
          POWERNETPRO
        </div>
        <div className="text-sm mt-1">For Better Tomorrow</div>
      </div>

      <h1 className="text-2xl font-bold my-5">WELCOME</h1>

      <Link
        to="/login"
        className="bg-[#4caf50] text-white font-bold py-3 px-5 rounded w-full max-w-[200px] text-center mb-3"
      >
        LOGIN AS CLIENT
      </Link>

      <Link to="/signup" className="bg-black text-white font-bold py-3 px-5 rounded w-full max-w-[200px] text-center">
        SignUp
      </Link>

      <div className="mt-5 text-sm cursor-pointer">Privacy Policy</div>
    </div>
  )
}

export default Welcome

