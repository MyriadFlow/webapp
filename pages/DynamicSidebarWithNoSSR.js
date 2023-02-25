import dynamic from 'next/dynamic';

const DynamicSidebarWithNoSSR = dynamic(() => import('../pages/index'), {
    ssr: false
});

export default function R() {
    return (
        <div>
            <DynamicSidebarWithNoSSR />
        </div>
    );
}
