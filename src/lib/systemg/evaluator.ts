/**
 * Évaluateur d'expressions du Système G.
 *
 * Le player legacy (C#, 2009) définit chaque note et chaque durée comme une
 * expression arithmétique (ex. `SOLG = LAG*8/9`), résolue récursivement à
 * travers deux dictionnaires (gamme, puis définitions locales de la
 * partition). Ce module reproduit exactement cette sémantique :
 *   - identifiants insensibles à la casse ;
 *   - opérateurs + - * / et parenthèses ;
 *   - résolution récursive des symboles, avec détection de cycle.
 *
 * Les calculs se font en double précision, comme `JsMath.Eval` du legacy.
 */

/** Résout un nom de symbole vers son expression, ou undefined s'il est inconnu. */
export type SymbolResolver = (name: string) => string | undefined;

/** Erreur levée quand un symbole n'est pas défini (message aligné sur le legacy). */
export class UndefinedSymbolError extends Error {
  constructor(public readonly symbol: string) {
    super(`${symbol} is not defined`);
    this.name = 'UndefinedSymbolError';
  }
}

/** Erreur levée sur une expression mal formée ou une définition circulaire. */
export class ExpressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpressionError';
  }
}

type Token =
  | { kind: 'number'; value: number }
  | { kind: 'ident'; name: string }
  | { kind: 'op'; op: '+' | '-' | '*' | '/' | '(' | ')' };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '(' || ch === ')') {
      tokens.push({ kind: 'op', op: ch });
      i++;
      continue;
    }
    if (ch >= '0' && ch <= '9') {
      let j = i;
      while (j < expr.length && ((expr[j] >= '0' && expr[j] <= '9') || expr[j] === '.')) j++;
      const value = Number(expr.slice(i, j));
      if (Number.isNaN(value)) throw new ExpressionError(`Invalid number in "${expr}"`);
      tokens.push({ kind: 'number', value });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let j = i;
      while (j < expr.length && /[a-zA-Z0-9_]/.test(expr[j])) j++;
      tokens.push({ kind: 'ident', name: expr.slice(i, j) });
      i = j;
      continue;
    }
    throw new ExpressionError(`Unexpected character "${ch}" in "${expr}"`);
  }
  return tokens;
}

/**
 * Évalue une expression en résolvant récursivement les identifiants via
 * `resolve`. Un identifiant est d'abord résolu en expression, laquelle est
 * évaluée à son tour (équivalent de la substitution textuelle du legacy).
 */
export function evaluate(expr: string, resolve: SymbolResolver): number {
  return evalWithStack(expr, resolve, []);
}

function evalWithStack(expr: string, resolve: SymbolResolver, stack: string[]): number {
  const tokens = tokenize(expr);
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr(): number {
    let value = parseTerm();
    while (peek()?.kind === 'op' && ((peek() as any).op === '+' || (peek() as any).op === '-')) {
      const op = (next() as any).op;
      const rhs = parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parseFactor();
    while (peek()?.kind === 'op' && ((peek() as any).op === '*' || (peek() as any).op === '/')) {
      const op = (next() as any).op;
      const rhs = parseFactor();
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  }

  function parseFactor(): number {
    const tok = next();
    if (!tok) throw new ExpressionError(`Unexpected end of expression in "${expr}"`);
    if (tok.kind === 'number') return tok.value;
    if (tok.kind === 'ident') {
      const key = tok.name.toUpperCase();
      if (stack.includes(key)) {
        throw new ExpressionError(`Circular definition of ${tok.name}`);
      }
      const sub = resolve(tok.name);
      if (sub === undefined) throw new UndefinedSymbolError(tok.name);
      stack.push(key);
      const value = evalWithStack(sub, resolve, stack);
      stack.pop();
      return value;
    }
    if (tok.kind === 'op' && tok.op === '(') {
      const value = parseExpr();
      const close = next();
      if (!close || close.kind !== 'op' || close.op !== ')') {
        throw new ExpressionError(`Missing ")" in "${expr}"`);
      }
      return value;
    }
    if (tok.kind === 'op' && tok.op === '-') return -parseFactor();
    if (tok.kind === 'op' && tok.op === '+') return parseFactor();
    throw new ExpressionError(`Unexpected token in "${expr}"`);
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new ExpressionError(`Trailing content in "${expr}"`);
  return result;
}

/**
 * Fabrique un résolveur à partir d'une chaîne de dictionnaires, par ordre de
 * priorité décroissante (le legacy consulte dictRun avant dictNote).
 * Les clés doivent être stockées en MAJUSCULES.
 */
export function chainResolvers(...tables: ReadonlyMap<string, string>[]): SymbolResolver {
  return (name: string) => {
    const key = name.toUpperCase();
    for (const table of tables) {
      const found = table.get(key);
      if (found !== undefined) return found;
    }
    return undefined;
  };
}
