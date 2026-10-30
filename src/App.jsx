import React, { useState } from 'react';
import { supabase } from './services/supabase';
import CameraCard from './components/CameraCard';
import {
  ShieldCheck,
  CarFront,
  FileText,
  ClipboardCheck,
  Camera,
  Clock3,
  CheckCircle2,
  Menu,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  BadgeCheck,
  LoaderCircle,
  AlertCircle
} from 'lucide-react';
import './App.css';

const dadosIniciais = {
  nome_segurado: '',
  placa_veiculo: '',
  modelo_veiculo: '',
  data_ocorrencia: '',
  local_acidente: '',
  descricao: ''
};

export default function App() {
  const [dados, setDados] = useState(dadosIniciais);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [fotoKey, setFotoKey] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  const atualizarCampo = (evento) => {
    const { name, value } = evento.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  };

  const cadastrarOcorrencia = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setMensagem('');
    setTipoMensagem('');

    try {
      const { error } = await supabase
        .from('ocorrencias')
        .insert({
          nome_segurado: dados.nome_segurado.trim(),
          placa_veiculo: dados.placa_veiculo.trim().toUpperCase(),
          modelo_veiculo: dados.modelo_veiculo.trim(),
          data_ocorrencia: dados.data_ocorrencia,
          local_acidente: dados.local_acidente.trim(),
          descricao: dados.descricao.trim(),
          foto_url: fotoUrl
        });

      if (error) throw error;

      setMensagem('Ocorrência cadastrada com sucesso no Supabase!');
      setTipoMensagem('success');
      setDados(dadosIniciais);
      setFotoUrl(null);
      setFotoKey((anterior) => anterior + 1);
    } catch (error) {
      console.error('Erro ao cadastrar ocorrência:', error);
      setMensagem(
        error?.message || 'Não foi possível cadastrar a ocorrência. Tente novamente.'
      );
      setTipoMensagem('error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="container nav-content">
          <a href="#" className="brand">
            <div className="brand-icon">
              <ShieldCheck size={25} />
            </div>
            <div>
              <strong>Auto<span>Express</span></strong>
              <small>SEGURADORA DIGITAL</small>
            </div>
          </a>

          <nav className="navigation">
            <a href="#inicio">Início</a>
            <a href="#registro">Registrar sinistro</a>
            <a href="#etapas">Como funciona</a>
          </nav>

          <a className="support-button" href="tel:08001234567">
            <Phone size={16} />
            Suporte
          </a>

          <button className="mobile-menu" aria-label="Menu" type="button">
            <Menu />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <ShieldCheck size={15} />
                PROTEÇÃO E TRANQUILIDADE
              </div>

              <h1>
                Seu caminho seguro
                <br />
                começa <span>com a gente.</span>
              </h1>

              <p>
                Teve uma colisão? Registre a ocorrência de maneira
                simples e rápida. Fotografe os danos do veículo
                diretamente pelo seu dispositivo.
              </p>

              <a href="#registro" className="primary-button">
                Registrar meu sinistro
                <ArrowRight size={18} />
              </a>

              <div className="hero-features">
                <div>
                  <Shield size={19} />
                  <span>Dados protegidos</span>
                </div>
                <div>
                  <Clock3 size={19} />
                  <span>Registro rápido</span>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1613214150384-5b6f9c2b2f5d?auto=format&fit=crop&w=1000&q=85"
                alt="Automóvel em uma estrada"
              />
              <div className="image-card">
                <div className="image-card-icon">
                  <BadgeCheck size={23} />
                </div>
                <div>
                  <strong>Conte com nossa proteção</strong>
                  <small>Estamos aqui para ajudar você.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container stats-grid">
            <div>
              <ShieldCheck />
              <strong>Segurança</strong>
              <span>Seus dados protegidos</span>
            </div>
            <div>
              <Camera />
              <strong>Registro digital</strong>
              <span>Fotos direto pelo celular</span>
            </div>
            <div>
              <ClipboardCheck />
              <strong>Praticidade</strong>
              <span>Processo simplificado</span>
            </div>
          </div>
        </section>

        <section className="registration-section" id="registro">
          <div className="container">
            <div className="section-heading">
              <div className="eyebrow">
                <FileText size={15} />
                CENTRAL DE ATENDIMENTO
              </div>
              <h2>Registro de sinistro</h2>
              <p>
                Preencha os dados da ocorrência e envie as
                fotografias dos danos do veículo.
              </p>
            </div>

            <div className="registration-layout">
              <form className="form-card" onSubmit={cadastrarOcorrencia}>
                <div className="card-heading">
                  <div className="heading-icon">
                    <CarFront size={23} />
                  </div>
                  <div>
                    <h3>Dados da ocorrência</h3>
                    <span>Identificação do sinistro</span>
                  </div>
                  <span className="status">
                    {enviando ? 'Enviando...' : 'Em preenchimento'}
                  </span>
                </div>

                <div className="form-grid">
                  <label>
                    Nome do segurado
                    <input
                      type="text"
                      name="nome_segurado"
                      placeholder="Digite seu nome completo"
                      value={dados.nome_segurado}
                      onChange={atualizarCampo}
                      required
                    />
                  </label>

                  <label>
                    Placa do veículo
                    <input
                      type="text"
                      name="placa_veiculo"
                      placeholder="ABC-1234"
                      maxLength={8}
                      value={dados.placa_veiculo}
                      onChange={atualizarCampo}
                      required
                    />
                  </label>

                  <label>
                    Modelo do veículo
                    <input
                      type="text"
                      name="modelo_veiculo"
                      placeholder="Ex.: Honda Civic"
                      value={dados.modelo_veiculo}
                      onChange={atualizarCampo}
                      required
                    />
                  </label>

                  <label>
                    Data da ocorrência
                    <input
                      type="date"
                      name="data_ocorrencia"
                      value={dados.data_ocorrencia}
                      onChange={atualizarCampo}
                      required
                    />
                  </label>

                  <label className="full-width">
                    Local do acidente
                    <div className="input-icon">
                      <MapPin size={17} />
                      <input
                        type="text"
                        name="local_acidente"
                        placeholder="Endereço ou local da ocorrência"
                        value={dados.local_acidente}
                        onChange={atualizarCampo}
                        required
                      />
                    </div>
                  </label>

                  <label className="full-width">
                    Descrição da ocorrência
                    <textarea
                      rows="4"
                      name="descricao"
                      placeholder="Descreva como aconteceu o acidente..."
                      value={dados.descricao}
                      onChange={atualizarCampo}
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={enviando}
                >
                  {enviando ? (
                    <>
                      <LoaderCircle className="spin" size={18} />
                      Cadastrando ocorrência...
                    </>
                  ) : (
                    <>
                      Finalizar cadastro
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {mensagem && (
                  <div className={`feedback ${tipoMensagem}`} role="status">
                    {tipoMensagem === 'success' ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <AlertCircle size={17} />
                    )}
                    <span>{mensagem}</span>
                  </div>
                )}
              </form>

              <div className="photo-column">
                <CameraCard key={fotoKey} onFotoEnviada={setFotoUrl} />

                <div className="help-card">
                  <ShieldCheck size={20} />
                  <div>
                    <strong>Dica importante</strong>
                    <p>
                      Fotografe os danos de diferentes ângulos.
                      Procure manter boa iluminação e nitidez.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="steps-section" id="etapas">
          <div className="container">
            <div className="section-heading">
              <div className="eyebrow">
                <ClipboardCheck size={15} />
                SIMPLES ASSIM
              </div>
              <h2>Como funciona?</h2>
              <p>Três etapas para registrar sua ocorrência.</p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <span>01</span>
                <div className="step-icon"><FileText /></div>
                <h3>Informe os dados</h3>
                <p>Preencha as informações básicas do acidente.</p>
              </div>

              <div className="step-card">
                <span>02</span>
                <div className="step-icon"><Camera /></div>
                <h3>Registre as fotos</h3>
                <p>Utilize a câmera ou escolha imagens da galeria.</p>
              </div>

              <div className="step-card">
                <span>03</span>
                <div className="step-icon"><CheckCircle2 /></div>
                <h3>Finalize o registro</h3>
                <p>Confira as informações antes de concluir.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bottom-banner">
          <div className="container banner-content">
            <div>
              <h2>Conte com a Auto Express.</h2>
              <p>Mais tranquilidade em todos os caminhos.</p>
            </div>
            <a href="#registro" className="banner-button">
              Registrar ocorrência <ArrowRight size={17} />
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="brand footer-brand">
            <div className="brand-icon"><ShieldCheck size={24} /></div>
            <div>
              <strong>Auto<span>Express</span></strong>
              <small>SEGURADORA DIGITAL</small>
            </div>
          </div>
          <p>Projeto acadêmico • Programação para Dispositivos Móveis II</p>
          <span>© 2026 Seguradora Auto Express</span>
        </div>
      </footer>
    </div>
  );
}
