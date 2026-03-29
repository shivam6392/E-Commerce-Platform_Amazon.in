import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, TrendingUp, Zap } from 'lucide-react';
import { getProducts } from '../api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import './Home.css';

/* ── Constants ── */
const CATEGORIES = [
  { id: 'All', label: 'All Departments', icon: '🏪' },
  { id: 'Electronics', label: 'Electronics', icon: '💻' },
  { id: 'Clothing', label: 'Clothing & Fashion', icon: '👗' },
  { id: 'Books', label: 'Books', icon: '📚' },
  { id: 'Home & Kitchen', label: 'Home & Kitchen', icon: '🏠' },
  { id: 'Sports', label: 'Sports & Outdoors', icon: '⚽' },
  { id: 'Toys', label: 'Toys & Games', icon: '🎮' },
];

const HERO_SLIDES = [
  {
    bg: 'linear-gradient(120deg,#0f2027,#203a43,#2c5364)',
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 40% off on Laptops, Phones, TVs & More',
    badge: '🔥 Today\'s Deal',
    accent: '#ff9900',
    cat: 'Electronics',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  },
  {
    bg: 'linear-gradient(120deg,#1a3a1a,#1e5128,#145a32)',
    title: 'Fashion Week Specials',
    subtitle: 'Discover latest trends · Min. 35% off',
    badge: '✨ New Arrivals',
    accent: '#a8ff78',
    cat: 'Clothing',
