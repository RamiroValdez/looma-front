import { useMyWorks } from "../../../../../infrastructure/services/MyWorksService";
import type { WorkDTO } from "../../../../../domain/dto/WorkDTO";

export function useMyWorksPage(userId: number | undefined) {
  const { data: myWorks = [], isLoading, error } = useMyWorks(userId || 0);

  const hasWorks = myWorks.length > 0;

  const groupsMap = myWorks.reduce<Record<string, WorkDTO[]>>((acc, work) => {
    const formatName = work.format?.name || 'Desconocido';
    if (!acc[formatName]) {
      acc[formatName] = [];
    }
    acc[formatName].push(work);
    return acc;
  }, {});

  const allGroups = Object.entries(groupsMap).map(([name, works]) => ({
    name: name.endsWith('s') ? name : `${name}s`,
    works,
  }));

  const firstGroup = allGroups.find(group => group.works.length > 0);

  return {
    isLoading,
    error,
    hasWorks,
    allGroups,
    firstGroup,
  };
}