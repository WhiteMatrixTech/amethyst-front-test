/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { BigNumber, ethers } from 'ethers';
import {
  AmethystFactoryProvider,
  AmethystFactoryClient,
  AmethystRoleManagementProvider,
  AmethystRoleManagementClient,
  DeploymentInfo
} from '@white-matrix/amethyst-sdk';

import styles from './Amethyst.module.less';
interface ContentProps {
  className?: string;
}

export function Amethyst(props: ContentProps) {
  const { className } = props;
  const ethProvider = useRef<ethers.providers.Web3Provider>();
  const amethystFactoryClient = useRef<AmethystFactoryClient>();
  const amethystRoleManagementClient = useRef<AmethystRoleManagementClient>();

  useEffect(() => {
    void initProvider();
  }, []);

  const [getAddressRes, setAddressRes] = useState<any>();
  const [getAmethystRoleTransactionRes, setAmethystRoleTransactionRes] =
    useState<any>();
  const [setAmethystRoleQuery, setSetAmethystRoleQuery] = useState({
    person: '',
    role: '',
    enable: false,
    timestamp: 0,
    signature: ''
  });
  const [getHasAmethystRoleRes, setHasAmethystRoleRes] = useState<any>();
  const [hasAmethystRoleQuery, setHasAmethystRoleQuery] = useState({
    person: '',
    role: ''
  });

  return (
    <div className={cn(styles.Content, className)}>
      <h2>Admin Actions</h2>
      <div className={styles.item}>
        <p>
          Connect to contract with address first, double check your current
          network
        </p>
        <div>address: {getAddressRes}</div>
      </div>
      <div className={styles.item}>
        {' '}
        <button onClick={() => setAmethystRole(setAmethystRoleQuery)}>
          setAmethystRole
        </button>
        <input
          onChange={(e) =>
            setSetAmethystRoleQuery({
              ...setAmethystRoleQuery,
              person: e.target.value
            })
          }
          placeholder="person"
        />
        <input
          onChange={(e) =>
            setSetAmethystRoleQuery({
              ...setAmethystRoleQuery,
              role: e.target.value
            })
          }
          placeholder="role"
        />
        <input
          onChange={(e) =>
            setSetAmethystRoleQuery({
              ...setAmethystRoleQuery,
              enable: Boolean(e.target.value)
            })
          }
          placeholder="enable"
        />
        <input
          onChange={(e) =>
            setSetAmethystRoleQuery({
              ...setAmethystRoleQuery,
              timestamp: parseInt(e.target.value)
            })
          }
          placeholder="timestamp"
        />
        <input
          onChange={(e) =>
            setSetAmethystRoleQuery({
              ...setAmethystRoleQuery,
              signature: e.target.value
            })
          }
          placeholder="signature"
        />
        <div>res: {getAmethystRoleTransactionRes}</div>
      </div>
      <div className={styles.item}>
        {' '}
        <button onClick={() => hasAmethystRole(hasAmethystRoleQuery)}>
          hasAmethystRole
        </button>
        <input
          onChange={(e) =>
            setHasAmethystRoleQuery({
              ...hasAmethystRoleQuery,
              person: e.target.value
            })
          }
          placeholder="person"
        />
        <input
          onChange={(e) =>
            setHasAmethystRoleQuery({
              ...hasAmethystRoleQuery,
              role: e.target.value
            })
          }
          placeholder="role"
        />
        <div>res:{JSON.stringify(getHasAmethystRoleRes)}</div>
      </div>
    </div>
  );

  async function initProvider() {
    const ethereum: any = window.ethereum;
    if (ethereum) {
      try {
        await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        throw new Error('Connection refused');
      }
      ethProvider.current = new ethers.providers.Web3Provider(ethereum);
      amethystFactoryClient.current = AmethystFactoryProvider(false);
      amethystRoleManagementClient.current =
        AmethystRoleManagementProvider(false);

      await amethystFactoryClient.current.connectProvider(
        DeploymentInfo.rinkeby.amethystFactory.proxyAddress,
        ethProvider.current
      );

      await amethystRoleManagementClient.current.connectProvider(
        DeploymentInfo.rinkeby.amethystRoleManagement.proxyAddress,
        ethProvider.current
      );

      const signer = ethProvider.current.getSigner();
      amethystRoleManagementClient.current.connectSigner(signer);
      amethystFactoryClient.current.connectSigner(signer);

      amethystRoleManagementClient.current.setWaitConfirmations(1);
      amethystFactoryClient.current.setWaitConfirmations(1);

      setAddressRes(await signer.getAddress());
    } else {
      throw new Error('Please use a browser that supports web3 to open');
    }
  }

  async function setAmethystRole(data: {
    person: string;
    role: string;
    enable: boolean;
    timestamp: number;
    signature: string;
  }) {
    try {
      const res = await amethystRoleManagementClient.current?.setAmethystRole(
        data.person,
        data.role,
        data.enable,
        data.timestamp,
        data.signature
      );
      setAmethystRoleTransactionRes(res);
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  async function hasAmethystRole(data: { person: string; role: string }) {
    try {
      const res = await amethystRoleManagementClient.current?.hasAmethystRole(
        data.person,
        data.role,
        {}
      );
      setHasAmethystRoleRes(res);
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }
}
