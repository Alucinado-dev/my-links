// Importa as bibliotecas necessárias
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Função utilitária `cn` para combinar classes Tailwind.
 * Aceita strings, arrays, objetos e combina condicionalmente com twMerge para evitar conflitos.
 *
 * @param inputs - Variados tipos de valores de classe (string, objeto, array, etc.)
 * @returns Uma string com todas as classes combinadas e sem conflitos
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Exemplo de uso:

// Combinação simples
const buttonClass = cn(
  'px-4 py-2 rounded-md',
  'bg-blue-500 hover:bg-blue-600',
  { 'text-white': true, 'opacity-50': false },
  'px-6', // Esta classe sobrescreve px-4
)
console.log(buttonClass)
// Saída esperada: "px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"

// Uso em JSX/React
/*
<button className={cn("px-4 py-2 rounded", isPrimary && "bg-blue-500 text-white")}>
  Clique Aqui
</button>
*/
