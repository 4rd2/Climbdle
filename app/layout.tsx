import './globals.css'
export const metadata = {title: 'CRUX — A little beta for your brain', description: 'Guess the climbing term in CRUX, the daily climbing word game.'}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="stylesheet" href="/style.css" /></head><body>{children}</body></html>}
