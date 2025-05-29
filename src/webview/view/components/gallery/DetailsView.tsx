import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { Messenger } from '@estruyf/vscode/dist/client';
import { WebviewCommand } from '../../../../constants';
import { BackIcon, DesktopDownloadIcon, GitHubIcon } from '../icons';
import { Sample } from '../../../../models';


export interface IDetailsViewProps {}

export const DetailsView: React.FunctionComponent<IDetailsViewProps> = ({ }: React.PropsWithChildren<IDetailsViewProps>) => {
  const [docs, setDocs] = useState<string>('');
  const [sample, setSample] = useState<Sample>();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { item } = state;
    setSample(item);
    window.scrollTo(0, 0);
    const url = item.url.replace('github.com', 'raw.githubusercontent.com').replace('/blob', '').replace('/tree', '');
    const urlParts = item.url.replace('https://github.com/', '').split('/');
    const user = urlParts[0];
    const repo = urlParts[1];
    const branch = urlParts[3];
    const path = urlParts.slice(4).join('/');

    const getImageMap = async (): Promise<Map<string, string>> => {
      const apiUrl = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;
      const res = await fetch(apiUrl);
      const json = await res.json();
      const map = new Map<string, string>();

      if (!json.tree) return map;

      json.tree.forEach((item: any) => {
        if (
          item.type === 'blob' &&
          item.path.startsWith(`${path}/`) &&
          /\.(png|jpe?g|gif|svg)$/i.test(item.path)
        ) {
          const fileName = item.path.split('/').pop()?.toLowerCase();
          if (fileName) map.set(fileName, item.path);
        }
      });

      return map;
    };

    const fixImageReferences = (markdown: string, imageMap: Map<string, string>): string => {
      return markdown.replace(/(!\[[^\]]*\]\()([^\)\s]+)(\s*("[^"]*")?\))/gi, (match, p1, p2, p3) => {
        const cleanUrl = p2.split('?')[0]; 
        const parts = cleanUrl.split('/');
        const fileName = parts.pop()?.toLowerCase();
        const correctedPath = imageMap.get(fileName || '');
        if (correctedPath) {
          const fullUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${correctedPath}`;
          return `${p1}${fullUrl}${p3}`;
        }
        return match;
      });
    };

    const fixHtmlImageTags = (
      markdown: string,
      imageMap: Map<string, string>
    ): string => {
      return markdown.replace(/<img[^>]*src=['"]([^'"]+)['"][^>]*>/gi, (match, src) => {
        const cleanUrl = src.split('?')[0];
        const parts = cleanUrl.split('/');
        const fileName = parts.pop()?.toLowerCase();
        const correctedPath = imageMap.get(fileName || '');

        if (correctedPath) {
          const fullUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${correctedPath}`;
          return match.replace(src, fullUrl);
        }

        return match;
      });
    };


    const fixRelativePaths = (markdown: string): string => {
      return markdown
        .replace(/\]\(<assets\/([^>]+)>\)/g, `](${url}/assets/$1)`)
        .replace(/\]\(assets /g, `](${url}/assets/`)
        .replace(/\]\(<images\/([^>]+)>\)/g, `](${url}/images/$1)`)
        .replace(/\]\(images /g, `](${url}/images/`)
        .replace(/\]\(<assets/g, `](${url}/assets`)
        .replace(/\]\(assets/g, `](${url}/assets`)
        .replace(/\]\(<images/g, `](${url}/images`)
        .replace(/\]\(images/g, `](${url}/images`)
        .replace(/\]\(\.\/assets/g, `](${url}/assets`)
        .replace(/\]\(\.\/images/g, `](${url}/images`)
        .replace(/<img src="\.\/assets/g, `<img src="${url}/assets`)
        .replace(/<img src="assets/g, `<img src="${url}/assets`)
        .replace(/<img src="\.\/images/g, `<img src="${url}/images`)
        .replace(/<img src="images/g, `<img src="${url}/images`)
        .replace(/(\]\([^)]+) ([^)]+\))/g, '$1%20$2')
        .replace(/<img src='([^']+)' alt='([^']+)' \/>/g, `<img src="$1" alt="$2" />`)
        .replace(/(<img src="[^"]+) ([^"]+")/g, '$1%20$2')
        .replace(/<img src="https:\/\/m365-visitor-stats\.azurewebsites\.net\/[^"]*" \/>/g, '');
    };

    const fetchData = async () => {
      const readmeRes = await fetch(`${url}/README.md`);
      let content = await readmeRes.text();
      const imageMap = await getImageMap();

      content = fixImageReferences(content, imageMap);
      content = fixRelativePaths(content);
      content = fixHtmlImageTags(content, imageMap);

      setDocs(content);
    };

  fetchData();
}, []);


  const onRepoClick = () => {
    if(sample?.url) {
      Messenger.send(WebviewCommand.toVSCode.redirectTo, sample.url);
    }
  };

  const onSampleClick = () => {
    if(sample) {
      Messenger.send(WebviewCommand.toVSCode.useSample, sample);
    }
  };

  const onBackClick = () => {
    navigate('/sp-dev-fx-samples', {});
  };

  return (
    <div className={'sample_details w-full h-full max-w-7xl mx-auto px-6'}>
      <div className={'sample_details_controls fixed w-full top-0 left-0 px-4 py-2'}>
        <div className={'flex w-full px-4'}>
          <div className={'w-1/2'}>
            <VSCodeButton className={'mb-2'} onClick={onBackClick} title={'Back'}>
              <span slot={'start'}><BackIcon /></span>
              Back
            </VSCodeButton>
          </div>
          <div className={'w-1/2 text-right'}>
            <VSCodeButton className={'mb-2 mr-2'} onClick={onRepoClick} title={'View in GitHub'}>
              <span slot={'start'}><GitHubIcon /></span>
              Repo
            </VSCodeButton>
            <VSCodeButton className={'mb-2 mr-2'} onClick={onSampleClick} title={'Use sample'}>
              <span slot={'start'}><DesktopDownloadIcon /></span>
              Use
            </VSCodeButton>
          </div>
        </div>
      </div>
      <div className={'sample_details_md mt-16 pb-10'}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}  >{docs}</ReactMarkdown>
      </div>
    </div>
  );
};