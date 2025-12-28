import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">About Bengali Bondhu</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Bengali Bondhu is a unique AI chat application designed to help people connect with Bengali culture
              through conversation. Our three AI personas - Raisa, Partho, and Rudro - each represent different aspects
              of Bengali society and culture.
            </p>

            <h2>Our Mission</h2>
            <p>
              Our mission is to create a bridge between cultures through conversation. Whether you're learning Bangla,
              interested in Bengali culture, or simply looking for a friendly chat, our AI companions are here to help.
            </p>

            <h2>The Technology</h2>
            <p>
              Bengali Bondhu is powered by GPT-4o-mini, a state-of-the-art language model that has been fine-tuned to
              understand and generate text in both English and Bangla. Our personas have been carefully crafted to
              provide authentic conversational experiences that reflect different aspects of Bengali culture.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions, feedback, or would like to learn more about Bengali Bondhu, please contact us
              at <a href="mailto:mir.m.reza@gmail.com">mir.m.reza@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
