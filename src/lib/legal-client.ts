/**
 * L'interrupteur de mesure d'audience des mentions légales.
 *
 * Dit au visiteur où il en est — ce build ne mesure pas, son navigateur
 * demande à ne pas être suivi, il a coupé la mesure, ou ses visites sont
 * comptées — et lui laisse poser ou retirer la clé de refus d'Umami dans ce
 * navigateur. Le traceur, déjà chargé ou non au chargement de la page, lit la
 * même clé (audience-client.ts) : le choix vaut dès la page suivante. Les
 * textes viennent du bloc lui-même (attributs data-*), écrits par le build
 * dans la langue de la page.
 */
import { AUDIENCE_SETTINGS_ID } from './audience';
import { optedOut, privacySignal, setOptedOut } from './audience-signals';

type State = 'none' | 'signal' | 'off' | 'on';

function currentState(): State {
  if (!document.getElementById(AUDIENCE_SETTINGS_ID)) return 'none';
  if (privacySignal()) return 'signal';
  return optedOut() ? 'off' : 'on';
}

function render(root: HTMLElement, state: HTMLElement, button: HTMLButtonElement): void {
  const current = currentState();
  state.textContent = root.dataset[current] ?? '';
  const switchable = current === 'on' || current === 'off';
  button.hidden = !switchable;
  button.textContent = current === 'off' ? (root.dataset.resume ?? '') : (root.dataset.stop ?? '');
}

export function mountAudienceSwitch(root: HTMLElement): void {
  const state = root.querySelector<HTMLElement>('[data-role="state"]');
  const button = root.querySelector<HTMLButtonElement>('button');
  if (!state || !button) return;
  button.addEventListener('click', () => {
    setOptedOut(!optedOut());
    render(root, state, button);
  });
  render(root, state, button);
}

const root = document.getElementById('audience-switch');
if (root) mountAudienceSwitch(root);
