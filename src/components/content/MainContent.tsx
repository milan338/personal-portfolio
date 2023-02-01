import HeroSection from './HeroSection';
import ProjectsSection from './ProjectsSection';

export default function MainContent() {
    return (
        <section
            id="main-content"
            className="relative z-10 flex h-auto w-[min(80vw,_48rem)] flex-col items-center"
        >
            <HeroSection />
            <ProjectsSection />
        </section>
    );
}
