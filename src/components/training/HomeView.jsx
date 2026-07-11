import { ContinueCourse } from '../home/ContinueCourse';
import { CourseModules } from '../home/CourseModules';
import { CourseProgress } from '../home/CourseProgress';
import { HeroSection } from '../home/HeroSection';
import { HomeFooter, HomeInfoSections, QuickAccess } from '../home/HomeInfoSections';
import { MainLayout } from '../home/MainLayout';
import './Home.css';

const TOTAL_MODULES = 6;

export function HomeView({
  nome,
  tela,
  filtroArea,
  totalCenarios,
  tentativas,
  acertos,
  taxa,
  areas,
  onSair,
  onNavigate,
  onSelecionarTrilha,
}) {
  const completedModules = Math.min(TOTAL_MODULES, Math.floor(tentativas / 5));
  const courseProgress = Math.min(
    100,
    Math.max(taxa, Math.round((completedModules / TOTAL_MODULES) * 100))
  );
  const diagramsViewed = Math.min(totalCenarios, tentativas);
  const evaluationStatus = tentativas > 0 ? 'Em andamento' : 'Não iniciada';
  const certificateStatus = taxa === 100 && tentativas > 0 ? 'Liberado' : 'Bloqueado';

  function handleNavigate(destination) {
    if (destination.type === 'area' && areas.includes(destination.value)) {
      onSelecionarTrilha(destination.value);
      return;
    }

    onNavigate(destination.value);
  }

  function handleOpenModule(module) {
    if (module.area && areas.includes(module.area)) {
      onSelecionarTrilha(module.area);
      return;
    }

    onNavigate(module.target || 'simulador');
  }

  return (
    <MainLayout
      nome={nome}
      tela={tela}
      filtroArea={filtroArea}
      areas={areas}
      onNavigate={handleNavigate}
      onSair={onSair}
    >
      <HeroSection />

      <section className="home-progress-and-continue">
        <CourseProgress
          progress={courseProgress}
          completedModules={completedModules}
          totalModules={TOTAL_MODULES}
          lessonsCompleted={tentativas}
          diagramsViewed={diagramsViewed}
          evaluationStatus={evaluationStatus}
          certificateStatus={certificateStatus}
        />
        <ContinueCourse
          progress={courseProgress}
          onContinue={() => onNavigate('simulador')}
        />
      </section>

      <CourseModules
        completedModules={completedModules}
        onOpenModule={handleOpenModule}
      />

      <HomeInfoSections />
      <QuickAccess onNavigate={handleNavigate} />
      <HomeFooter />
    </MainLayout>
  );
}
