import Loader from '@/src/app/loading.js'

export default function Page() {
  return (
  <>
    <Loader />
    <div className="p-10 m-10 text-4xl font-bold text-center">
        <span>
            Esto es el fondo de la Ventana
        </span>
    </div>
  </>
  )
}