import { useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import LineChart from '../components/LineChart'

export const HomePage = () => {

  const { request, loading } = useHttp()
  const auth = useContext(AuthContext)

  //=======================================
  //=======================================

  const toast = useToast()

  const notify = useCallback(
    (data) => {
      toast({
        title: data.title && data.title,
        description: data.description && data.description,
        status: data.status && data.status,
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    },
    [toast],
  )

  //=======================================
  //=======================================

  const months = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentabr',
    'Oktabr',
    'Noyabr',
    'Dekabr'
  ]

  const [monthlyReport, setMonthlyReport] = useState({
    clients: [],
    totalsum: []
  })

  const getMonthlyReport = useCallback(async () => {
    try {
      const data = await request(
        `/api/offline/monthly/get`,
        'POST',
        { clinica: auth && auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setMonthlyReport(data);
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [auth, notify, request])

  console.log(monthlyReport);

  //=============================================
  //=============================================

  const [t, setT] = useState(0)

  useEffect(() => {
    if (!t) {
      setT(1)
      getMonthlyReport()
    }
  }, [t, getMonthlyReport])

  return (
    <section
      className={
        'pl-[2.5rem] py-[1.25rem] pr-[2.5rem] flex flex-col gap-[5rem] overflow-y-auto overflow-x-hidden'
      }
    >
      <div className={'h-[25rem]'}>
        <LineChart
          label={[
            'Oylik mijoz soni',
            `${months[new Date().getMonth()]} : ${monthlyReport?.clients.length > 0
              ? monthlyReport.clients[
              monthlyReport.clients.length - 1
              ]
              : 0
            } ${'ta'}`,
          ]}
          arr={monthlyReport?.clients}
        />
      </div>
      <div className={'h-[25rem]'}>
        <LineChart
          label={[
            'Oylik daromad',
            `${months[new Date().getMonth()]} : ${monthlyReport?.totalsum.length > 0
              ? monthlyReport.totalsum[
              monthlyReport.totalsum.length - 1
              ]
              : 0
            } ${'ta'}`,
          ]}
          arr={monthlyReport?.totalsum}
        />
      </div>
    </section>
  )
}
