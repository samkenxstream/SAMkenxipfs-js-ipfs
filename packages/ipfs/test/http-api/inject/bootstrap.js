/* eslint-env mocha */
'use strict'

const { expect } = require('interface-ipfs-core/src/utils/mocha')
const qs = require('qs')
const defaultList = require('../../../src/core/runtime/config-nodejs.js')().Bootstrap
const testHttpMethod = require('../../utils/test-http-method')
const http = require('../../utils/http')
const sinon = require('sinon')

describe('/bootstrap', () => {
  const validIp4 = '/ip4/101.236.176.52/tcp/4001/p2p/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z'
  let ipfs

  beforeEach(() => {
    ipfs = {
      bootstrap: {
        list: sinon.stub(),
        add: sinon.stub(),
        rm: sinon.stub()
      }
    }
  })

  describe('/list', () => {
    it('only accepts POST', () => {
      return testHttpMethod('/api/v0/bootstrap/list')
    })

    it('returns a list', async () => {
      ipfs.bootstrap.list.returns({
        Peers: defaultList
      })

      const res = await http({
        method: 'POST',
        url: '/api/v0/bootstrap/list'
      }, { ipfs })

      expect(res).to.have.property('statusCode', 200)
      expect(res).to.have.deep.nested.property('result.Peers', defaultList)
    })

    it('alias', async () => {
      ipfs.bootstrap.list.returns({
        Peers: defaultList
      })

      const res = await http({
        method: 'POST',
        url: '/api/v0/bootstrap'
      }, { ipfs })

      expect(res).to.have.property('statusCode', 200)
      expect(res).to.have.deep.nested.property('result.Peers', defaultList)
    })
  })

  describe('/add', () => {
    it('only accepts POST', () => {
      const query = {
        arg: validIp4
      }

      return testHttpMethod(`/api/v0/bootstrap/add?${qs.stringify(query)}`)
    })

    it('adds a bootstrapper', async () => {
      ipfs.bootstrap.add.withArgs(validIp4).returns({
        Peers: [
          validIp4
        ]
      })

      const query = {
        arg: validIp4
      }

      const res = await http({
        method: 'POST',
        url: `/api/v0/bootstrap/add?${qs.stringify(query)}`
      }, { ipfs })

      expect(res).to.have.property('statusCode', 200)
      expect(res).to.have.deep.nested.property('result.Peers', [validIp4])
    })

    it('restores default', async () => {
      ipfs.bootstrap.add.withArgs(null).returns({
        Peers: defaultList
      })

      const res = await http({
        method: 'POST',
        url: '/api/v0/bootstrap/add/default'
      }, { ipfs })

      expect(res).to.have.property('statusCode', 200)
      expect(res).to.have.deep.nested.property('result.Peers', defaultList)
    })
  })

  describe('/rm', () => {
    it('only accepts POST', () => {
      const query = {
        arg: validIp4
      }

      return testHttpMethod(`/api/v0/bootstrap/rm?${qs.stringify(query)}`)
    })

    it('removes a bootstrapper', async () => {
      ipfs.bootstrap.rm.withArgs(validIp4).returns({
        Peers: [
          validIp4
        ]
      })

      const query = {
        arg: validIp4
      }

      const res = await http({
        method: 'POST',
        url: `/api/v0/bootstrap/rm?${qs.stringify(query)}`
      }, { ipfs })

      expect(res).to.have.property('statusCode', 200)
      expect(res).to.have.deep.nested.property('result.Peers', [validIp4])
    })

    it('removes all bootstrappers', async () => {
      ipfs.bootstrap.rm.withArgs(null).returns({
        Peers: defaultList
      })

      const res = await http({
        method: 'POST',
        url: '/api/v0/bootstrap/rm/all'
      }, { ipfs })

      expect(res).to.have.property('statusCode', 200)
      expect(res).to.have.deep.nested.property('result.Peers', defaultList)
    })
  })
})
