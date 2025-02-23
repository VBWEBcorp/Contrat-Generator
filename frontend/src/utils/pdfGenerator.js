import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateContractPDF = (contract, client) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;

  // Informations de l'entreprise
  const companyInfo = {
    name: 'VBWEB',
    owner: 'Victor BEASSE',
    address: '3 allée beau rivage',
    city: '35690 Acigné',
    phone: '+33 (6) 61 64 12 57',
    email: 'contact@vbweb.fr',
    siret: '918 936 139 00016'
  };

  // Informations bancaires
  const bankInfo = [
    'Coordonnées bancaires:',
    'Titulaire: Victor BEASSE',
    'RIB: 1445 20200 04075899277 10',
    'IBAN: FR76 1444 5202 0004 0758 9927 710',
    'BIC: CEPAFRPP444'
  ];

  // Fonction utilitaire pour centrer le texte
  const centerText = (text, y) => {
    const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    pdf.text(text, x, y);
  };

  // Fonction pour ajouter les informations d'en-tête
  const addHeader = () => {
    // Informations VBWEB (gauche)
    pdf.setFontSize(10);
    pdf.text(companyInfo.name, margin, 20);
    pdf.text(companyInfo.owner, margin, 25);
    pdf.text(companyInfo.address, margin, 30);
    pdf.text(companyInfo.city, margin, 35);
    pdf.text(`Tél: ${companyInfo.phone}`, margin, 40);
    pdf.text(`Email: ${companyInfo.email}`, margin, 45);
    pdf.text(`SIRET: ${companyInfo.siret}`, margin, 50);

    // Informations Client (droite)
    const rightMargin = pageWidth - margin - 60;
    pdf.text('CLIENT:', rightMargin, 20);
    pdf.text(client.name, rightMargin, 25);
    pdf.text(client.address || '', rightMargin, 30);
    pdf.text(`Tél: ${client.phone || ''}`, rightMargin, 35);
    pdf.text(`Email: ${client.email || ''}`, rightMargin, 40);
    pdf.text(`SIRET: ${client.siret}`, rightMargin, 45);
  };

  // Fonction pour ajouter le pied de page
  const addFooter = () => {
    pdf.setFontSize(8);
    const footerY = pdf.internal.pageSize.height - 30;
    bankInfo.forEach((line, index) => {
      pdf.text(line, margin, footerY + (index * 4));
    });
  };

  // Page 1: Titre et détails
  addHeader();
  
  // Titre du contrat
  pdf.setFontSize(22);
  pdf.setFont(undefined, 'bold');
  centerText(contract.title.toUpperCase(), 80);
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  
  // Informations du contrat
  pdf.text(`Contrat N° : ${contract.number}`, margin, 100);
  pdf.text(`Date : ${contract.date}`, margin, 110);
  
  // Description du contrat
  pdf.text('DESCRIPTION :', margin, 130);
  const descriptionLines = pdf.splitTextToSize(contract.description, pageWidth - 2 * margin);
  pdf.text(descriptionLines, margin, 140);

  addFooter();

  // Page 2: Conditions générales et signatures
  pdf.addPage();
  addHeader();
  
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  centerText('CONDITIONS GÉNÉRALES DE SERVICE', 80);
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  const conditionsLines = pdf.splitTextToSize(contract.conditions, pageWidth - 2 * margin);
  pdf.text(conditionsLines, margin, 100);

  // Section signatures
  pdf.text('SIGNATURES', margin, 220);
  
  // Pour le client
  pdf.text('Le client :', margin, 240);
  pdf.text('Nom et signature', margin, 250);
  pdf.text('(précédé de la mention "Lu et approuvé")', margin, 260);
  
  // Pour VBWEB
  pdf.text('Pour VBWEB :', pageWidth - margin - 50, 240);
  pdf.text('Nom et signature', pageWidth - margin - 50, 250);

  addFooter();

  // Page 3: Détails des prestations (si présent)
  if (contract.details && contract.details.trim() !== '') {
    pdf.addPage();
    addHeader();
    
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    centerText('DÉTAIL DES PRESTATIONS', 80);
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    const detailsLines = pdf.splitTextToSize(contract.details, pageWidth - 2 * margin);
    pdf.text(detailsLines, margin, 100);

    addFooter();
  }

  return pdf.output('blob');
};
