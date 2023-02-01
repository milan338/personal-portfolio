import DiamondsBackground from 'components/DiamondsBackground';
import MainContent from 'components/content/MainContent';

export default function Home() {
    return (
        <>
            <main className="flex min-h-0 justify-center bg-neutral-50">
                <DiamondsBackground />
                <MainContent />
            </main>

            <footer className="h-28" />
        </>
    );
}
