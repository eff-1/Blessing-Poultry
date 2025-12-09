import { NavigationBar } from '../components/Landing/Navbar'
import { ChristmasHero } from '../components/Landing/ChristmasHero'
import { About } from '../components/Landing/About'
import { Products } from '../components/Landing/Products'
import { Gallery } from '../components/Landing/Gallery'
import { Testimonials } from '../components/Landing/Testimonials'
import { Contact } from '../components/Landing/Contact'
import { Footer } from '../components/Landing/Footer'
import { WhatsAppFloat } from '../components/Landing/WhatsAppFloat'

export const Home = () => {
  return (
    <>
      <NavigationBar />
      <ChristmasHero />
      <About />
      <Products />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
