import { FC, useCallback, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Copy } from './copy'
import { useNavigate } from 'react-router-dom';

type AlertProps = {
  msg: string;
  show: boolean;
  onClose: () => void;
  navBtn?: boolean;
  center?: boolean;
  btnText?: string;
  isCopy?: boolean
}

export const Alert: FC<AlertProps> = ({
  msg,
  show,
  onClose,
  navBtn,
  center,
  btnText,
  isCopy
}) => {
  const navigate = useNavigate()
  const handleNavTask = () => {
    navigate("/point_info")
    // try {
    //   //@ts-ignore
    //   JsBridge?.openNativePage?.(JSON.stringify({ "pageName": "get-integral" }))
    // } catch (error) {
    //   //@ts-ignore
    //   dsBridge.call("openNativePage", JSON.stringify({ "pageName": "get-integral" }))
    // }
  }

  return (
    <Transition show={show} as={Fragment}>
      <Dialog open={true} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-20 fixed inset-0 bg-black/30" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed z-30 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-80 max-w-sm rounded bg-white p-6 flex gap-4 flex-col">
                <Dialog.Title className={center ? "text-base font-medium items-center justify-center flex" : "text-base font-medium"}>
                  {msg}
                  {
                    isCopy ? (
                      <button className="text-[#ff6a33] text-sm pt-3 w-full font-medium border-none">
                        <Copy btntype="text" ctx={msg} />
                      </button>
                    ) : null
                  }
                </Dialog.Title>
                <Dialog.Description className="flex gap-2">

                  {
                    navBtn ? (
                      <>
                        <button className=" text-sm py-3 w-full text-black font-medium rounded border border-black/10" onClick={onClose} >
                          取消
                        </button>
                        <button className="bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded" onClick={handleNavTask} >
                          {
                            btnText ? btnText : '获取积分'
                          }

                        </button>
                      </>
                    ) : (
                      <button className="bg-[#ff6a33] text-sm py-3 w-full text-white font-medium rounded" onClick={onClose} >
                        确定
                      </button>
                    )
                  }

                </Dialog.Description>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
