import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export class FormatUtils {
  static formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }

  static formatNutrient(value: number, unit: string): string {
    return `${value.toFixed(1)}${unit}`;
  }

  static formatShoppingList(items: string[], planInfo: {
    name?: string;
    dietType?: string;
    calorieTarget?: number;
    date?: string;
  }): string {
    const header = `
Plan de Comidas - ${planInfo.name || 'Sin nombre'}
Fecha: ${planInfo.date || this.formatDate(new Date())}
${planInfo.dietType ? `Tipo de dieta: ${planInfo.dietType}` : ''}
${planInfo.calorieTarget ? `Calorías diarias: ${planInfo.calorieTarget} kcal` : ''}

Lista de Compras (${items.length} ingredientes):
`;
    
    const itemsList = items.map(item => `• ${item}`).join('\n');
    return header + itemsList;
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}