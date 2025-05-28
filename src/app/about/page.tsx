import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos de JuridX | Abderrahman Adel - Cabinet Juridique International",
  description: "Découvrez JuridX, cabinet de conseil juridique international fondé par Abderrahman Adel. Expertise en droit des affaires, structuration juridique multi-juridictionnelle et accompagnement stratégique.",
  keywords: ["JuridX", "Juridx", "Abderrahman Adel", "cabinet juridique", "conseil juridique international", "droit des affaires", "Londres"],
  openGraph: {
    title: "À Propos de JuridX | Abderrahman Adel",
    description: "Découvrez JuridX, cabinet de conseil juridique international fondé par Abderrahman Adel.",
    url: "https://juridx.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            À Propos de <span className="text-[#D4AF37]">JuridX</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            JuridX est un cabinet de conseil juridique international de premier plan, 
            fondé par Abderrahman Adel, spécialisé dans l'accompagnement stratégique 
            des entreprises et investisseurs.
          </p>
        </div>

        {/* Founder Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-[#D4AF37]">
              Abderrahman Adel - Fondateur de JuridX
            </h2>
            <p className="text-gray-300 mb-4">
              <strong>JuridX</strong> a été fondé par Abderrahman Adel, juriste international 
              diplômé de l'Université de Londres. Avec plus de 10 ans d'expérience académique 
              et professionnelle, il incarne un profil rare à la croisée du juridique, 
              de la technologie et de la stratégie d'entreprise.
            </p>
            <p className="text-gray-300 mb-4">
              La vision de <strong>JuridX</strong> est de révolutionner le conseil juridique 
              international en combinant expertise traditionnelle et innovation technologique.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-[#D4AF37]">Qualifications</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• LL.M. en droit international des affaires (Université de Londres)</li>
              <li>• MSc en Intelligence Artificielle & Data Science</li>
              <li>• Honours Bachelor of Engineering</li>
              <li>• Certificat d'études supérieures en relations internationales</li>
            </ul>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#D4AF37]">
            La Mission de JuridX
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Excellence</h3>
              <p className="text-gray-300">
                JuridX s'engage à fournir des services juridiques de la plus haute qualité, 
                adaptés aux défis complexes du droit international.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Innovation</h3>
              <p className="text-gray-300">
                JuridX intègre les dernières technologies et méthodologies pour 
                optimiser les solutions juridiques et stratégiques.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Partenariat</h3>
              <p className="text-gray-300">
                JuridX développe des relations durables avec ses clients, 
                devenant un véritable partenaire stratégique.
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#D4AF37]">
            Pourquoi Choisir JuridX ?
          </h2>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Expertise Unique</h3>
                <p className="text-gray-300 mb-4">
                  JuridX combine expertise juridique traditionnelle et vision technologique, 
                  offrant une approche unique dans le conseil juridique international.
                </p>
                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Approche Multi-juridictionnelle</h3>
                <p className="text-gray-300">
                  JuridX maîtrise les complexités des structures juridiques internationales 
                  et accompagne ses clients dans leurs projets transfrontaliers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Résultats Prouvés</h3>
                <p className="text-gray-300 mb-4">
                  Les clients de JuridX bénéficient d'un accompagnement personnalisé 
                  et de solutions juridiques innovantes qui dépassent leurs attentes.
                </p>
                <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">Vision Stratégique</h3>
                <p className="text-gray-300">
                  JuridX ne se contente pas de résoudre les problèmes juridiques, 
                  mais anticipe les défis futurs et propose des stratégies proactives.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-[#D4AF37] text-black p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Travailler avec JuridX ?
          </h2>
          <p className="text-lg mb-6">
            Contactez JuridX dès aujourd'hui pour discuter de vos besoins juridiques 
            et découvrir comment nous pouvons vous accompagner.
          </p>
          <a 
            href="/consultation" 
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Consultation Gratuite
          </a>
        </div>
      </div>
    </div>
  );
} 