
import React, { useState } from 'react';
import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import {
  Camera as CameraIcon,
  Images,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ShieldCheck
} from 'lucide-react';

export default function CameraCard() {
  const [fotoSinistro, setFotoSinistro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  const capturarSinistro = async () => {
    setCarregando(true);
    setMensagem('');
    setTipoMensagem('');

    try {
      // Abre o seletor nativo de câmera ou galeria.
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,

        promptLabelHeader: 'Registrar sinistro',
        promptLabelPhoto: 'Escolher da galeria',
        promptLabelPicture: 'Tirar uma foto'
      });

      // Verifica se o Capacitor retornou uma imagem válida.
      if (image && image.webPath) {
        setFotoSinistro(image.webPath);
        setMensagem('Fotografia registrada com sucesso!');
        setTipoMensagem('success');
      } else {
        throw new Error('A imagem não retornou um endereço válido.');
      }

    } catch (error) {
      // Trata cancelamento ou falha sem derrubar a aplicação.
      console.warn('Captura cancelada ou erro:', error);

      setMensagem(
        'A operação foi cancelada ou não foi possível acessar a imagem. Você pode tentar novamente.'
      );

      setTipoMensagem('error');

    } finally {
      // Encerra o carregamento mesmo quando ocorre um erro.
      setCarregando(false);
    }
  };

  const removerFoto = () => {
    setFotoSinistro(null);
    setMensagem('');
    setTipoMensagem('');
  };

  return (
    <div className="camera-card">
      <div className="camera-card-header">
        <div className="heading-icon">
          <CameraIcon size={23} />
        </div>

        <div>
          <h3>Fotografias do sinistro</h3>
          <span>Registro visual dos danos</span>
        </div>
      </div>

      <div className="camera-content">
        {!fotoSinistro ? (
          <div className="empty-photo">
            <div className="empty-camera-icon">
              <CameraIcon size={36} />
            </div>

            <h4>Nenhuma foto adicionada</h4>

            <p>
              Abra sua câmera ou escolha uma imagem
              salva no seu dispositivo.
            </p>
          </div>
        ) : (
          <div className="photo-preview">
            <img
              src={fotoSinistro}
              alt="Fotografia do sinistro automotivo"
            />

            <button
              type="button"
              className="remove-photo"
              onClick={removerFoto}
              aria-label="Remover fotografia"
            >
              <X size={18} />
            </button>

            <div className="photo-label">
              <CheckCircle2 size={16} />
              Foto adicionada
            </div>
          </div>
        )}

        <button
          type="button"
          className="camera-button"
          onClick={capturarSinistro}
          disabled={carregando}
        >
          {carregando ? (
            <>
              <LoaderCircle className="spin" size={19} />
              Abrindo câmera...
            </>
          ) : (
            <>
              <CameraIcon size={19} />
              Tirar Foto / Galeria
            </>
          )}
        </button>

        <div className="gallery-hint">
          <Images size={16} />
          <span>Você pode fotografar ou selecionar uma imagem existente.</span>
        </div>

        {mensagem && (
          <div className={`feedback ${tipoMensagem}`}>
            {tipoMensagem === 'success' ? (
              <CheckCircle2 size={17} />
            ) : (
              <AlertCircle size={17} />
            )}
            <span>{mensagem}</span>
          </div>
        )}
      </div>

      <div className="camera-footer">
        <ShieldCheck size={15} />
        Imagens exibidas diretamente na aplicação.
      </div>
    </div>
  );
}
