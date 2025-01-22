import { useProfileData } from "./useProfileData";

export const useProfileQueries = () => {
  const {
    userQuery,
    transactionsQuery,
    totalXpQuery,
    auditsQuery,
    statsQuery,
    skillsQuery,
    levelQuery,
  } = useProfileData();

  const loadingStates = [
    userQuery.loading,
    transactionsQuery.loading,
    totalXpQuery.loading,
    auditsQuery.loading,
    statsQuery.loading,
    skillsQuery.loading,
    levelQuery.loading,
  ];

  const errorStates = [
    userQuery.error,
    transactionsQuery.error,
    totalXpQuery.error,
    auditsQuery.error,
    statsQuery.error,
    skillsQuery.error,
    levelQuery.error,
  ];

  return {
    userQuery,
    transactionsQuery,
    totalXpQuery,
    auditsQuery,
    statsQuery,
    skillsQuery,
    levelQuery,
    loadingStates,
    errorStates,
  };
};
