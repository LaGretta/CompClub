import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ZoneDetails from '../components/ZoneDetails';
import BookingMap from '../components/BookingMap';
import ClubsMap from '../components/ClubsMap';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';

export default function Home({ onRequireAuth }) {
  return (
    <main className="page-animate">
      <Hero />
      
      <Reveal direction="up" delay={100}>
        <Features />
      </Reveal>
      
      <ZoneDetails />
      
      <Reveal direction="up" delay={100}>
        <BookingMap onRequireAuth={onRequireAuth} />
      </Reveal>
      
      <Reveal direction="up" delay={100}>
        <ClubsMap />
      </Reveal>
      
      <Reveal direction="up" delay={100}>
        <Reviews />
      </Reveal>
      
      <Footer />
    </main>
  );
}