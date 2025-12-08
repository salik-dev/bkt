'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export interface ShippingData {
  fullName: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingData) => void;
  initialData?: Partial<ShippingData>;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
}

export function ShippingForm({ onSubmit, initialData = {} }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingData>({
    fullName: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    phone: '',
    ...initialData
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: FormErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof ShippingData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    
    setTouched(allTouched);
    
    if (isValid) {
      onSubmit(formData);
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
        
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email';
        }
        break;
        
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!/^\+?[0-9\s-]{10,}$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
        
      case 'address':
        if (!value.trim()) error = 'Address is required';
        break;
        
      case 'postalCode':
        if (!value) error = 'Postal code is required';
        else if (!/^[0-9]{4,10}$/.test(value)) {
          error = 'Please enter a valid postal code';
        }
        break;
        
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: ShippingData) => ({
      ...prev,
      [name]: value
    }));
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 ${touched.fullName && errors.fullName ? 'border-red-500' : ''}`}
        />
        {touched.fullName && errors.fullName && (
          <p className="text-sm tracking-wide text-red-500 mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 ${touched.email && errors.email ? 'border-red-500' : ''}`}
        />
        {touched.email && errors.email && (
          <p className="text-sm tracking-wide text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 ${touched.phone && errors.phone ? 'border-red-500' : ''}`}
        />
        {touched.phone && errors.phone && (
          <p className="text-sm tracking-wide text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">Street Address *</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 ${touched.address && errors.address ? 'border-red-500' : ''}`}
        />
        {touched.address && errors.address && (
          <p className="text-sm tracking-wide text-red-500 mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 ${touched.postalCode && errors.postalCode ? 'border-red-500' : ''}`}
          />
          {touched.postalCode && errors.postalCode && (
            <p className="text-sm tracking-wide text-red-500 mt-1">{errors.postalCode}</p>
          )}
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 ${touched.city && errors.city ? 'border-red-500' : ''}`}
          />
          {touched.city && errors.city && (
            <p className="text-sm tracking-wide text-red-500 mt-1">{errors.city}</p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-[#8bc34a] hover:bg-[#7cb342] text-white py-6 text-lg"
        >
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}
