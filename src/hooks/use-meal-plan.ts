// // Ejemplo de cómo quedaría el hook principal simplificado:
// export function useMealPlan() {
//   const store = useMealPlansStore();
//   const utils = useMealPlansUtils();
//   const api = useMealPlanAPI(); // Nueva abstracción

//   return {
//     // Estado
//     ...store,
    
//     // Acciones optimizadas
//     generatePlan: api.generatePlan,
//     regenerateMeal: api.regenerateMeal,
    
//     // Utilidades
//     ...utils,
    
//     // Nuevas características
//     exportToPDF: utils.exportToPDF,
//     compareNutrition: utils.compareNutrition,
//     suggestSubstitutions: api.suggestSubstitutions,
//   };
// }