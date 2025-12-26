import { useState, useRef, useEffect, useCallback } from 'react';
import { actions } from 'astro:actions';
import { PUBLIC_BRAND_NAME, PUBLIC_OWNER_NAME } from 'astro:env/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Share2 } from 'lucide-react';

const TOPICS = [
  { id: 'website', label: 'Website' },
  { id: 'beratung', label: 'Beratung' },
  { id: 'webapp', label: 'Web-App' },
  { id: 'optimierung', label: 'Website-Optimierung' },
  { id: 'entwicklung', label: 'Entwicklung' }
] as const;

type TopicId = (typeof TOPICS)[number]['id'];

const STYLES = [
  { id: 'authentisch', label: 'Authentisch (Standard)' },
  { id: 'locker', label: 'Locker & kurzweilig' },
  { id: 'sachlich', label: 'Sachlich & klar' },
  { id: 'begeistert', label: 'Begeistert & positiv' },
  { id: 'kurz', label: 'Sehr kurz (1–2 Sätze)' }
] as const;

type StyleId = (typeof STYLES)[number]['id'];

// Customer type: solo business (ich/meine) vs company (wir/unsere)
const CUSTOMER_TYPES = [
  { id: 'individual', label: 'Einzelunternehmen (ich)' },
  { id: 'company', label: 'Firma/Unternehmen (wir)' }
] as const;

type CustomerTypeId = (typeof CUSTOMER_TYPES)[number]['id'];

interface ReviewFormProps {
  googleReviewUrl: string;
  initialTopics?: string;
  initialStyle?: string;
  initialCustomerType?: string;
  initialHint?: string;
}

/**
 * Parse URL params for form pre-configuration
 * URL format: ?topics=website,beratung&style=locker&type=company&hint=schnell
 */
function parseUrlParams(): Partial<{
  topics: TopicId[];
  style: StyleId;
  customerType: CustomerTypeId;
  hint: string;
}> {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const result: Partial<{
    topics: TopicId[];
    style: StyleId;
    customerType: CustomerTypeId;
    hint: string;
  }> = {};

  // Parse topics (comma-separated)
  const topicsParam = params.get('topics');
  if (topicsParam) {
    const validTopicIds = TOPICS.map((t) => t.id);
    const parsedTopics = topicsParam
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => validTopicIds.includes(t as TopicId)) as TopicId[];
    if (parsedTopics.length > 0) {
      result.topics = parsedTopics;
    }
  }

  // Parse style
  const styleParam = params.get('style');
  if (styleParam) {
    const validStyleIds = STYLES.map((s) => s.id);
    if (validStyleIds.includes(styleParam as StyleId)) {
      result.style = styleParam as StyleId;
    }
  }

  // Parse customer type
  const typeParam = params.get('type');
  if (typeParam) {
    const validTypes = CUSTOMER_TYPES.map((ct) => ct.id);
    if (validTypes.includes(typeParam as CustomerTypeId)) {
      result.customerType = typeParam as CustomerTypeId;
    }
  }

  // Parse hint
  const hintParam = params.get('hint');
  if (hintParam) {
    result.hint = hintParam.slice(0, 80); // Max 80 chars
  }

  return result;
}

/**
 * Build shareable URL from current form state
 */
function buildShareUrl(
  topics: TopicId[],
  style: StyleId,
  customerType: CustomerTypeId,
  hint: string
): string {
  if (typeof window === 'undefined') return '';

  const params = new URLSearchParams();

  if (topics.length > 0) {
    params.set('topics', topics.join(','));
  }
  if (style !== 'authentisch') {
    params.set('style', style);
  }
  if (customerType !== 'individual') {
    params.set('type', customerType);
  }
  if (hint.trim()) {
    params.set('hint', hint.trim());
  }

  const queryString = params.toString();
  const baseUrl = window.location.origin + window.location.pathname;

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export function ReviewForm({ googleReviewUrl }: ReviewFormProps) {
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>([]);
  const [hint, setHint] = useState('');
  const [style, setStyle] = useState<StyleId>('authentisch');
  const [customerType, setCustomerType] =
    useState<CustomerTypeId>('individual');
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  // Initialize form from URL params on mount
  useEffect(() => {
    const urlParams = parseUrlParams();
    if (urlParams.topics) setSelectedTopics(urlParams.topics);
    if (urlParams.style) setStyle(urlParams.style);
    if (urlParams.customerType) setCustomerType(urlParams.customerType);
    if (urlParams.hint) setHint(urlParams.hint);
  }, []);

  // Share current configuration
  const handleShare = useCallback(async () => {
    const shareUrl = buildShareUrl(selectedTopics, style, customerType, hint);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [selectedTopics, style, customerType, hint]);

  const toggleTopic = (topicId: TopicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleGenerate = async () => {
    if (selectedTopics.length === 0) {
      setError('Bitte wähle mindestens ein Thema aus');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: actionError } = await actions.generateReview({
      topics: selectedTopics,
      hint: hint.trim() || undefined,
      style,
      customerType
    });

    setIsLoading(false);

    if (actionError) {
      setError(actionError.message || 'Fehler beim Generieren');
      return;
    }

    if (data?.reviewText) {
      setReviewText(data.reviewText);
      // Scroll to text field after short delay (to allow DOM update)
      setTimeout(() => {
        reviewSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  };

  const handleCopy = async () => {
    if (!reviewText) return;

    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = reviewText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyAndOpenGoogle = async () => {
    // First copy to clipboard
    await handleCopy();
    // Then open Google
    window.open(googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  const charCount = reviewText.length;
  const isOverLimit = charCount > 500;
  const ownerName = PUBLIC_OWNER_NAME || 'Jan';
  const brandName = PUBLIC_BRAND_NAME || 'App bis Web';

  return (
    <Card className='w-full max-w-xl mx-auto shadow-lg'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Bewertung für {ownerName}
        </CardTitle>
        <CardDescription className='text-base'>
          Wähle die Themen aus, zu denen du {ownerName} ({ownerName} von{' '}
          {brandName}) bewerten möchtest. Wir erstellen dir einen Textvorschlag,
          den du anpassen kannst.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Style */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium'>Sprachstil</Label>
          <Select value={style} onValueChange={(v) => setStyle(v as StyleId)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Stil auswählen' />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Customer Type */}
        <div className='space-y-2'>
          <Label className='text-sm font-medium'>Kundenperspektive</Label>
          <Select
            value={customerType}
            onValueChange={(v) => setCustomerType(v as CustomerTypeId)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Perspektive wählen' />
            </SelectTrigger>
            <SelectContent>
              {CUSTOMER_TYPES.map((ct) => (
                <SelectItem key={ct.id} value={ct.id}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic Selection */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium'>Themen auswählen</Label>
          <div className='grid grid-cols-2 gap-3'>
            {TOPICS.map((topic) => (
              <label
                key={topic.id}
                className='flex items-center gap-3 p-3 rounded-lg border border-input bg-background hover:bg-accent/50 cursor-pointer transition-colors has-checked:border-primary has-checked:bg-primary/5'>
                <Checkbox
                  checked={selectedTopics.includes(topic.id)}
                  onCheckedChange={() => toggleTopic(topic.id)}
                />
                <span className='text-sm font-medium'>{topic.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Optional Hint */}
        <div className='space-y-2'>
          <Label htmlFor='hint' className='text-sm font-medium'>
            Stichwort{' '}
            <span className='text-muted-foreground font-normal'>
              (optional, max. 80 Zeichen)
            </span>
          </Label>
          <input
            id='hint'
            type='text'
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            maxLength={80}
            placeholder='z.B. schnelle Umsetzung, gute Kommunikation...'
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || selectedTopics.length === 0}
          className='w-full h-11 text-base font-semibold'>
          {isLoading ? (
            <span className='flex items-center gap-2'>
              <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                  fill='none'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Text wird erstellt...
            </span>
          ) : (
            'Text vorschlagen'
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className='p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm'>
            {error}
          </div>
        )}

        {/* Generated Review */}
        {reviewText && (
          <div ref={reviewSectionRef} className='space-y-3 pt-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='review' className='text-sm font-medium'>
                Dein Bewertungstext
              </Label>
              <span
                className={`text-xs font-mono ${
                  isOverLimit
                    ? 'text-destructive font-bold'
                    : 'text-muted-foreground'
                }`}>
                {charCount} / 500
              </span>
            </div>
            <Textarea
              id='review'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className='resize-none text-base leading-relaxed'
              placeholder='Hier erscheint dein generierter Text...'
            />

            {/* Action Buttons */}
            <div className='flex gap-3 flex-wrap'>
              <Button
                variant='outline'
                onClick={handleCopy}
                className='flex-1 h-11'>
                {copied ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Kopiert!
                  </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                      />
                    </svg>
                    Kopieren
                  </span>
                )}
              </Button>

              <Button
                onClick={copyAndOpenGoogle}
                className='flex-1 h-11 text-base font-semibold'>
                <span className='flex items-center gap-2'>
                  <svg
                    className='h-4 w-4'
                    viewBox='0 0 24 24'
                    fill='currentColor'>
                    <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                    <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                    <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                    <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                  </svg>
                  Jetzt bei Google bewerten
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Share Button - subtle, below the card */}
      <button
        onClick={handleShare}
        className='mx-auto flex items-center gap-1.5 py-3 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors'
        title='Link zum Teilen kopieren'>
        <Share2 className='h-3.5 w-3.5' />
        <span>{linkCopied ? 'Link kopiert!' : ' '}</span>
      </button>
    </Card>
  );
}
