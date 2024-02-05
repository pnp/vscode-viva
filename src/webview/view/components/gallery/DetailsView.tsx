import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

    const url = item.url.replace('github.com', 'raw.githubusercontent.com').replace('/blob', '').replace('/tree', '');

    const fetchData = async () => {
      const response = await fetch(`${url}/README.md`);
      let data = await response.text();
      data = data.replace(/\]\(assets/g, `](${url}/assets`);
      data = data.replace(/\]\(\.\/assets/g, `](${url}/assets`);
      data = data.replace(/<img src="https:\/\/m365-visitor-stats\.azurewebsites\.net\/[^"]*" \/>/g, '');
      setDocs(data);
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs}</ReactMarkdown>
      </div>
    </div>
  );
};