import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoodsData, List, ApiData } from '../types/goods'

type LoaderProps = {
  show: boolean
}

export const Loader: FC<LoaderProps> = ({
  show
}) => {

  if (!show) {
    return null
  }
  return (
    <div className="w-full flex items-center py-2 justify-center">
      <div className="sk-chase">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
    </div>
  )
}
