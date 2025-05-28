import { FC, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import copy from 'copy-text-to-clipboard'
import { Alert } from './alert'

type CopyProps = {
  btntype: 'btn' | 'text';
  ctx?: string
}

export const Copy: FC<CopyProps> = ({
  btntype,
  ctx
}) => {
  const navigate = useNavigate()
  const location = useLocation();
  const [msg, setMsg] = useState({
    msg: '',
    show: false
  })

  const handleCopy = () => {
    copy(`${ctx ?? ''}`)
    setMsg({
      show: true,
      msg: '复制成功'
    })
  }

  return (
    <>
      <Alert {...msg} onClose={() => {
        setMsg({
          show: false,
          msg: ''
        })
      }} />
      {
        btntype === 'btn' ? (
          <button className="border border-black/20 rounded text-black text-[12px] py-0.5 px-1.5" onClick={handleCopy}>
            复制
          </button>
        ) : (
          <button className="rounded  text-sm py-0.5 px-1.5" onClick={handleCopy}>
            复制内容
          </button>
        )
      }

    </>

  )
}
