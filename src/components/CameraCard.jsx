
import React, { useRef, useState } from 'react';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

import {
  Camera as CameraIcon,
  Images,
  X,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ShieldCheck
} from 'lucide-react';

import { supabase } from '../services/supabase';


export default function CameraCard({ onFotoEnviada }) {
  const [fotoSinistro, setFotoSinistro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const inputArquivoRef = useRef(null);
  const urlPreviewRef = useRef(null);

  const enviarImagem = async (arquivo, previewUrl, extensaoInformada) => {
    setCarregando(true);
    setMensagem('');
    setTipoMensagem('');

    try {
      const extensao = (extensaoInformada || arquivo.type?.split('/')[1] || 'jpeg')
        .replace('jpeg', 'jpg')
        .toLowerCase();
      const nomeArquivo = `sinistros/foto-${Date.now()}.${extensao}`;
      const tipoArquivo = arquivo.type || 'image/jpeg';

      const { data, error } = await supabase
        .storage
        .from('fotos-camera')
        .upload(nomeArquivo, arquivo, {
          contentType: tipoArquivo,
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase
        .storage
        .from('fotos-camera')
        .getPublicUrl(data.path);

      setFotoSinistro(previewUrl);
      onFotoEnviada?.(urlData.publicUrl);
      setMensagem('Fotografia enviada e armazenada com sucesso!');
      setTipoMensagem('success');
    } catch (error) {
      console.error('Erro ao enviar fotografia:', error);
      setMensagem(error?.message || 'Não foi possível enviar a fotografia. Tente novamente.');
      setTipoMensagem('error');
      onFotoEnviada?.(null);
    } finally {
      setCarregando(false);
    }
  };

  const capturarNoDispositivo = async () => {
    setMensagem('');
    setTipoMensagem('');

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Registrar sinistro',
        promptLabelPhoto: 'Escolher da galeria',
        promptLabelPicture: 'Tirar uma foto'
      });

      if (!image?.webPath) {
        throw new Error('A imagem não retornou um endereço válido.');
      }

      setCarregando(true);
      const resposta = await fetch(image.webPath);
      if (!resposta.ok) throw new Error('Não foi possível ler a imagem selecionada.');

      const arquivo = await resposta.blob();
      await enviarImagem(arquivo, image.webPath, image.format || 'jpeg');
    } catch (error) {
      console.warn('Captura cancelada ou erro:', error);
      // Cancelar o seletor nativo não deve deixar o botão travado.
      if (error?.message && !/cancel|user cancelled|canceled/i.test(error.message)) {
        setMensagem(error.message);
        setTipoMensagem('error');
      }
      setCarregando(false);
    }
  };

  const abrirSeletor = () => {
    setMensagem('');
    setTipoMensagem('');

    if (Capacitor.isNativePlatform()) {
      capturarNoDispositivo();
    } else {
      // No navegador, usa o seletor de arquivos nativo do próprio navegador.
      inputArquivoRef.current?.click();
    }
  };

  const selecionarArquivo = async (evento) => {
    const arquivo = evento.target.files?.[0];
    // Permite selecionar novamente a mesma imagem depois.
    evento.target.value = '';

    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/')) {
      setMensagem('Selecione um arquivo de imagem válido.');
      setTipoMensagem('error');
      return;
    }

    if (urlPreviewRef.current) {
      URL.revokeObjectURL(urlPreviewRef.current);
    }

    const previewUrl = URL.createObjectURL(arquivo);
    urlPreviewRef.current = previewUrl;
    await enviarImagem(arquivo, previewUrl);
  };

  const removerFoto = () => {
    if (urlPreviewRef.current) {
      URL.revokeObjectURL(urlPreviewRef.current);
      urlPreviewRef.current = null;
    }
    setFotoSinistro(null);
    onFotoEnviada?.(null);
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
        <input
          ref={inputArquivoRef}
          type="file"
          accept="image/*"
          onChange={selecionarArquivo}
          style={{ display: 'none' }}
        />

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
              disabled={carregando}
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
          onClick={abrirSeletor}
          disabled={carregando}
        >
          {carregando ? (
            <>
              <LoaderCircle className="spin" size={19} />
              Enviando fotografia...
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
        Imagens armazenadas no Supabase Storage.
      </div>
    </div>
  );
}
