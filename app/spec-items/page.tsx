
import Link from 'next/link';

const Page = () => {
    return <><h1>
            List of Pupils.... Nav to correct link
            <Link href={`/spec-items/${'p101'}`}>P101</Link>
        </h1></>
}

export default Page;