import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { signatureBase64, signatureWidth, signatureHeight } from '../assets/signature';

export const generateContractPDF = (contract, client) => {
  if (!contract || !client) {
    console.error('Contract or client is missing:', { contract, client });
    throw new Error('Contract or client is missing');
  }

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;

  // Couleurs de la charte graphique
  const colors = {
    primary: [38, 64, 96], // #264060 en RGB
    secondary: [78, 186, 236], // #4EBAEC en RGB
    text: [51, 51, 51]
  };

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

  // Fonction utilitaire pour centrer le texte
  const centerText = (text, y) => {
    const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    pdf.text(text, x, y);
  };

  // Fonction pour ajouter le numéro de page
  const addPageNumber = () => {
    const pages = pdf.internal.getNumberOfPages();
    const currentPage = pdf.internal.getCurrentPageInfo().pageNumber;
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.text);
    const text = `Page ${currentPage} sur ${pages}`;
    const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    const x = pageWidth - margin - textWidth;
    pdf.text(text, x, pageHeight - 15);
  };

  // Fonction pour ajouter le pied de page
  const addFooter = () => {
    const footerY = pageHeight - 30;
    
    // Ligne de séparation élégante
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(0.1);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    // Informations de l'entreprise en deux colonnes
    pdf.setFontSize(8);
    pdf.setTextColor(...colors.text);
    
    // Colonne gauche
    pdf.text(`${companyInfo.name}`, margin, footerY);
    pdf.text(`${companyInfo.address}`, margin, footerY + 4);
    pdf.text(`${companyInfo.city}`, margin, footerY + 8);
    
    // Colonne droite
    const rightColumnX = pageWidth - margin - 60;
    pdf.text(`SIRET: ${companyInfo.siret}`, rightColumnX, footerY);
    pdf.text(`Tél: ${companyInfo.phone}`, rightColumnX, footerY + 4);
    pdf.text(`Email: ${companyInfo.email}`, rightColumnX, footerY + 8);

    // Ajouter le numéro de page
    addPageNumber();
  };

  // Fonction pour dessiner une bordure décorative
  const drawBorder = () => {
    // Bordure principale avec dégradé
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(0.75);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Bordure intérieure plus fine
    pdf.setDrawColor(...colors.primary);
    pdf.setLineWidth(0.25);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Coin décoratif
    const cornerSize = 5;
    pdf.setLineWidth(0.5);
    // Coin supérieur gauche
    pdf.line(10, 15, 15, 15);
    pdf.line(15, 10, 15, 15);
    // Coin supérieur droit
    pdf.line(pageWidth - 15, 10, pageWidth - 15, 15);
    pdf.line(pageWidth - 15, 15, pageWidth - 10, 15);
    // Coin inférieur gauche
    pdf.line(10, pageHeight - 15, 15, pageHeight - 15);
    pdf.line(15, pageHeight - 15, 15, pageHeight - 10);
    // Coin inférieur droit
    pdf.line(pageWidth - 15, pageHeight - 15, pageWidth - 15, pageHeight - 10);
    pdf.line(pageWidth - 15, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  };

  // Fonction pour dessiner un séparateur
  const drawSeparator = (y) => {
    pdf.setDrawColor(...colors.secondary);
    pdf.setLineWidth(0.25);
    const dashLength = 3;
    const gapLength = 2;
    let x = margin;
    
    while (x < pageWidth - margin) {
      pdf.line(x, y, x + dashLength, y);
      x += dashLength + gapLength;
    }
  };

  // Fonction pour ajouter la signature de Victor
  const addVictorSignature = (x, y) => {
    try {
      console.log('Adding signature with params:', { x, y, signatureWidth, signatureHeight, base64Length: signatureBase64.length });
      
      // Vérifier que la signature est valide
      if (!signatureBase64 || !signatureBase64.startsWith('data:image')) {
        throw new Error('Invalid signature data');
      }

      // Ajouter l'image de la signature
      const signatureScale = 0.8; // Ajuster la taille de la signature
      pdf.addImage(
        signatureBase64,
        'PNG',
        x,
        y,
        signatureWidth * signatureScale,
        signatureHeight * signatureScale
      );
      console.log('Signature added successfully');
      
      // Ajouter la date
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.text);
      const today = new Date().toLocaleDateString('fr-FR');
      pdf.text(`Le ${today}`, x, y + signatureHeight * signatureScale + 5);
    } catch (error) {
      console.error('Error adding signature:', error);
      // Ajouter un texte à la place de la signature en cas d'erreur
      pdf.setFontSize(12);
      pdf.setTextColor(...colors.text);
      pdf.text('Victor BEASSE', x, y + 20);
    }
  };

  // Fonction pour ajouter les informations d'en-tête
  const addHeader = () => {
    drawBorder();

    // Logo ou nom de l'entreprise stylisé
    pdf.setFontSize(24);
    pdf.setTextColor(...colors.primary);
    pdf.setFont(undefined, 'bold');
    pdf.text(companyInfo.name, margin, 30);

    pdf.setFontSize(10);
    pdf.setTextColor(...colors.text);
    pdf.setFont(undefined, 'normal');

    // Informations VBWEB (gauche)
    pdf.text(companyInfo.owner, margin, 40);
    pdf.text(companyInfo.address, margin, 45);
    pdf.text(companyInfo.city, margin, 50);
    pdf.text(`Tél: ${companyInfo.phone}`, margin, 55);
    pdf.text(`Email: ${companyInfo.email}`, margin, 60);
    pdf.text(`SIRET: ${companyInfo.siret}`, margin, 65);

    // Informations Client (droite)
    const rightMargin = pageWidth - margin - 60;
    pdf.setFont(undefined, 'bold');
    pdf.text('CLIENT:', rightMargin, 30);
    pdf.setFont(undefined, 'normal');
    pdf.text(client.name, rightMargin, 40);
    pdf.text(client.address || '', rightMargin, 45);
    pdf.text(`Tél: ${client.phone || ''}`, rightMargin, 50);
    pdf.text(`Email: ${client.email || ''}`, rightMargin, 55);
    pdf.text(`SIRET: ${client.siret}`, rightMargin, 60);

    drawSeparator(75);
  };

  // Page 1: Informations du contrat
  addHeader();

  // Titre du document avec style amélioré
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...colors.primary);
  const title = contract.title || contract.type || 'CONTRAT';
  centerText(title.toUpperCase(), 95);
  
  // Ligne décorative sous le titre
  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(0.5);
  const titleWidth = pdf.getStringUnitWidth(title.toUpperCase()) * 24 / pdf.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  pdf.line(titleX, 98, titleX + titleWidth, 98);

  // Informations du contrat
  pdf.setFontSize(12);
  pdf.setTextColor(...colors.text);
  pdf.setFont(undefined, 'bold');
  pdf.text('INFORMATIONS DU CONTRAT', margin, 115);
  
  // Rectangle décoratif autour des informations
  const infoBoxMargin = 5;
  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(0.1);
  pdf.rect(
    margin - infoBoxMargin, 
    120 - infoBoxMargin, 
    160, 
    45,
    'S'
  );

  const contractInfo = [
    `Numéro: ${contract.number || 'N/A'}`,
    `Date: ${new Date(contract.date || Date.now()).toLocaleDateString('fr-FR')}`,
    `Montant: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(contract.amount || 0)}`,
    `Type: ${contract.type || 'N/A'}`
  ];

  contractInfo.forEach((line, index) => {
    pdf.text(line, margin, 130 + (index * 8));
  });

  // Description du contrat
  pdf.setFont(undefined, 'bold');
  pdf.text('DESCRIPTION :', margin, 170);
  pdf.setFont(undefined, 'normal');
  const descriptionLines = pdf.splitTextToSize(contract.description || 'Aucune description fournie', pageWidth - 2 * margin);
  pdf.text(descriptionLines, margin, 180);

  addFooter();

  // Page 2: Conditions générales et signatures
  pdf.addPage();
  addHeader();
  
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...colors.primary);
  centerText('CONDITIONS GÉNÉRALES DE SERVICE', 95);
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(...colors.text);
  const conditionsLines = pdf.splitTextToSize(
    contract.conditions || 'Les conditions générales de service sont disponibles sur demande.',
    pageWidth - 2 * margin
  );
  pdf.text(conditionsLines, margin, 115);

  // Section signatures avec plus d'espace
  pdf.setFont(undefined, 'bold');
  pdf.text('SIGNATURES', margin, 200);
  
  // Pour le client
  pdf.setFont(undefined, 'normal');
  pdf.text('Le client :', margin, 220);
  
  // Rectangle pour la signature client
  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(0.1);
  pdf.rect(margin, 225, 80, 40, 'S');
  pdf.setFontSize(8);
  pdf.text('Nom et signature', margin + 5, 230);
  pdf.text('(précédé de la mention "Lu et approuvé")', margin + 5, 235);

  // Pour VBWEB avec signature automatique
  pdf.text('Pour VBWEB :', pageWidth - margin - 80, 220);
  addVictorSignature(pageWidth - margin - 80, 225);

  // Ajouter une page pour les détails si présents
  if (contract.details && contract.details.trim() !== '') {
    pdf.addPage();
    addHeader();
    
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(...colors.primary);
    centerText('DÉTAIL DES PRESTATIONS', 95);
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(...colors.text);
    const detailsLines = pdf.splitTextToSize(contract.details, pageWidth - 2 * margin);
    pdf.text(detailsLines, margin, 115);
    addFooter();
  }

  try {
    // Retourner le PDF sous forme de Blob
    const pdfOutput = pdf.output('blob');
    return pdfOutput;
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw new Error('Failed to generate PDF');
  }
};
