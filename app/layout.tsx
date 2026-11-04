import './globals.css'
export const metadata = {title: 'Climbdle — Daily climbing puzzle', description: 'Guess the climbing term in Climbdle, the daily climbing word game.'}
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="stylesheet" href="/style.css" /></head><body>{children}</body></html>}
