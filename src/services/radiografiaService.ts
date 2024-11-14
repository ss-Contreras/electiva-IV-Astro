import axios from 'axios';

const API_BASE_URL = 'https://sonrisasbackendelectivaiv.somee.com/api/radiografia'; //

// Crear una nueva radiografía
export const crearRadiografia = async (formData: FormData) => {
  try {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || 'Error al crear la radiografía.';
  }
};

// Obtener radiografías recientes
export const obtenerRadiografiasRecientes = async (cantidad: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recientes`, {
      params: { cantidad },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || 'Error al obtener radiografías recientes.';
  }
};

// Eliminar una radiografía
export const eliminarRadiografia = async (id: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || 'Error al eliminar la radiografía.';
  }
};
