import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { RequireAuth } from './auth';
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import Undangan from './pages/Undangan';
import Dashboard from './pages/Dashboard';
import Guests from './pages/Guests';
import Login from './pages/Login';
import Tutorial from './pages/Tutorial';
import NotFound from './pages/NotFound';
import Acara from './pages/Acara';
import Fitur from './pages/Fitur';
import Paket from './pages/Paket';
import Checkout from './pages/Checkout';
import EditorTemplate from './pages/EditorTemplate';
import FAQ from './pages/FAQ';
import Bantuan from './pages/Bantuan';
import RequirePaidPlan from './components/RequirePaidPlan';
function ScrollManager(){const {pathname,hash}=useLocation();useEffect(()=>{if(hash){document.getElementById(hash.slice(1))?.scrollIntoView();return;}window.scrollTo(0,0)},[pathname,hash]);return null;}
export default function App(){return <><ScrollManager/><Routes><Route path="/" element={<Home/>}/><Route path="/acara" element={<Acara/>}/><Route path="/fitur" element={<Fitur/>}/><Route path="/paket" element={<Paket/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/katalog" element={<Katalog/>}/><Route path="/editor" element={<EditorTemplate/>}/><Route path="/undangan" element={<Undangan/>}/><Route path="/tutorial" element={<Tutorial/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/bantuan" element={<Bantuan/>}/><Route path="/masuk" element={<Login/>}/><Route path="/dashboard" element={<RequireAuth><RequirePaidPlan><Dashboard/></RequirePaidPlan></RequireAuth>}/><Route path="/dashboard/tamu" element={<RequireAuth><RequirePaidPlan><Guests/></RequirePaidPlan></RequireAuth>}/><Route path="*" element={<NotFound/>}/></Routes></>}
