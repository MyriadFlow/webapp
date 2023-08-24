export default function Home({ data }) {
    console.log(data);
    return (
        <>
        </>
    );
}

export async function getStaticProps() {
    const response = await fetch(
        'http://localhost:3000/api/getData');
    const data = await response.json();

    return {
        props: { data: data },
    };
}