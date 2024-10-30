import React from 'react'

type Props = {}

const Header = (props: Props) => {
  return (
    <nav
    className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all"
>
  <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
    <div className="container mx-auto flex justify-between items-center">
      <div
        className="flex h-14 items-center justify-between border-b border-zinc-200"
      >
        <a href="/" className="flex z-40 text-2xl md:text-4xl lg:text-2xl font-bold"> Sonrisas </a>
      </div>
      <div className="hidden items-center space-x-4 sm:flex">
        <a
          href="/agenda"
          className="px-4 py-2 border border-transparent hover:bg-blue-100 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
        >
          Agenda
        </a>
        <a
          href="/citas"
          className="px-4 py-2 border border-transparent hover:bg-blue-100 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mr-4"
        >
          Citas
        </a>
        {/* <a
        href="/pacientes"
        className="px-4 py-2 border border-transparent hover:bg-blue-100 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mr-4"
        >
        Pacientes
        </a>  */}
        <a
        href="/admin"
        className="px-4 py-2 border border-transparent hover:bg-blue-100 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mr-4"
        >
        Administración
      </a>
      </div>
    </div>
  </div>
</nav>

  )
}

export default Header