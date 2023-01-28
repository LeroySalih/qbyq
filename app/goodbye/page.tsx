import Link from 'next/link'

const Goodbye = () => {
    return <div className="page">
        <h3>You are signed out.</h3>
        <h1>Toodles!</h1>
        <Link href="/">Home</Link>
    </div>
}


export default Goodbye;