import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={course.imageUrl || 'https://via.placeholder.com/640x360?text=Curso'} 
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="mr-3">Nivel: {course.level}</span>
          <span>Duración: {course.duration}</span>
        </div>
        
        <div className="flex justify-end">
          <Button 
            as={Link} 
            to={`/courses/${course.id}`} 
            variant="primary"
            size="sm"
          >
            Ver curso
          </Button>
        </div>
      </div>
    </div>
  );
} 