import { defineEventHandler } from 'h3'
import { Product } from '../../types'

const coreSizes = ['6', '8', '10', '12', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
const genderChoices = [
  { label: 'Chico', value: 'chico' },
  { label: 'Chica', value: 'chica' }
]

const products: Product[] = [
  {
    id: 1,
    name: 'Sudadera Club 40 Aniversario',
    slug: 'sudadera-club-40-aniversario',
    description: 'Edición especial 40 aniversario con capucha, interior afelpado y colores oficiales.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1523380744952-b1a3e42aca56?auto=format&fit=crop&w=900&q=80',
    available: true,
    tags: ['edición limitada'],
    options: [
      {
        id: 'talla',
        label: 'Talla',
        type: 'select',
        required: true,
        choices: coreSizes.map((value) => ({ value, label: value }))
      },
      {
        id: 'genero',
        label: 'Género',
        type: 'select',
        required: true,
        helperText: 'Recuerda que las tallas varían entre chico y chica. Consulta la guía.',
        choices: genderChoices
      }
    ]
  },
  {
    id: 2,
    name: 'Pantalón de Chándal Club',
    slug: 'pantalon-chandal-club',
    description: 'Pantalón oficial con bolsillos y cremallera en el bajo.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    available: true,
    options: [
      {
        id: 'talla',
        label: 'Talla',
        type: 'select',
        required: true,
        choices: coreSizes.map((value) => ({ value, label: value }))
      }
    ]
  },
  {
    id: 3,
    name: 'Camiseta de Juego Blanca',
    slug: 'camiseta-juego-blanca',
    description: 'Primera equipación oficial. Personaliza con tu nombre y dorsal.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1600296636667-7d4c54d166af?auto=format&fit=crop&w=900&q=80',
    available: true,
    options: [
      {
        id: 'talla',
        label: 'Talla',
        type: 'select',
        required: true,
        choices: coreSizes.map((value) => ({ value, label: value }))
      },
      {
        id: 'genero',
        label: 'Género',
        type: 'select',
        required: true,
        choices: genderChoices
      },
      {
        id: 'numero',
        label: 'Número',
        type: 'number',
        placeholder: 'Ej. 12',
        helperText: 'Opcional. Si no tienes número asignado, déjalo vacío.',
        required: false
      },
      {
        id: 'nombre',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ej. Carmen',
        required: false,
        maxLength: 12
      }
    ]
  },
  {
    id: 4,
    name: 'Camiseta de Juego Negra',
    slug: 'camiseta-juego-negra',
    description: 'Segunda equipación oficial. Personalizable para partidos fuera de casa.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
    available: true,
    options: [
      {
        id: 'talla',
        label: 'Talla',
        type: 'select',
        required: true,
        choices: coreSizes.map((value) => ({ value, label: value }))
      },
      {
        id: 'genero',
        label: 'Género',
        type: 'select',
        required: true,
        choices: genderChoices
      },
      {
        id: 'numero',
        label: 'Número',
        type: 'number',
        placeholder: 'Ej. 18',
        required: false
      },
      {
        id: 'nombre',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ej. Daniela',
        required: false,
        maxLength: 12
      }
    ]
  },
  {
    id: 5,
    name: 'Camiseta de Calentamiento',
    slug: 'camiseta-calentamiento',
    description: 'Camiseta ligera para antes de los partidos y entrenamientos.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1549057446-9f5c6ac91a02?auto=format&fit=crop&w=900&q=80',
    available: true,
    options: [
      {
        id: 'talla',
        label: 'Talla',
        type: 'select',
        required: true,
        choices: coreSizes.map((value) => ({ value, label: value }))
      },
      {
        id: 'genero',
        label: 'Género',
        type: 'select',
        required: true,
        choices: genderChoices
      }
    ]
  },
  {
    id: 6,
    name: 'Mochila Oficial',
    slug: 'mochila-oficial',
    description: 'Mochila reforzada con compartimentos ventilados para zapatillas.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    available: true,
    options: []
  },
  {
    id: 7,
    name: 'Llavero Personalizable',
    slug: 'llavero-personalizable',
    description: 'Próximamente podrás elegir nombre, número y color. Mantente atento.',
    price: 8,
    image: 'https://images.unsplash.com/photo-1528459199957-65a3d61c9ce9?auto=format&fit=crop&w=900&q=80',
    available: false,
    tags: ['próximamente'],
    options: [
      {
        id: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: false,
        maxLength: 10
      },
      {
        id: 'numero',
        label: 'Número',
        type: 'number',
        required: false
      },
      {
        id: 'color',
        label: 'Color',
        type: 'select',
        choices: [
          { label: 'Naranja', value: 'naranja' },
          { label: 'Negro', value: 'negro' },
          { label: 'Blanco', value: 'blanco' }
        ]
      }
    ]
  }
]

export default defineEventHandler(() => ({
  products
}))
