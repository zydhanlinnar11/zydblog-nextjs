import { FC, MouseEventHandler } from 'react'

type Props = {
  type?: 'button' | 'reset' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button: FC<Props> = ({ children, type, disabled, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className='rounded-md border-2 border-opacity-50 border-gray-600
      w-full h-10 mt-3 hover:bg-blue-600 hover:bg-opacity-30 transition-colors
      duration-100 focus:bg-blue-900 focus:bg-opacity-30
      disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed'
    >
      {children}
    </button>
  )
}

export default Button