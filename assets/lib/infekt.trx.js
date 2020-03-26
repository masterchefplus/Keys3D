$(window).scroll(function() {
  if ($(window).scrollTop() > 0) {
    $('#scrolltop').fadeIn();
  } else {
    $('#scrolltop').fadeOut();
  }
});

if ($(window).scrollTop() > 0) {
  $('#scrolltop').fadeIn();
}

var FEE_LIMIT = 1e7;

var myAddress;
var blockNumber = 0;
var lastInvestedAt = 0;
var prevLastInvestedAtBlock;
var gameStarted = false;
var gameStartIn = 0;
var prevGameStartIn;
var totalInvested = 0;
var totalFrozenAmount = 0;
var contractAddress = 'TUX8V8YwpAVk8BHcXeVLgHGb2DC7UQxfEU';
var totalPaid = 17000013;
var divsCounter = 5812;
var tronWebExternal = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: 'a5bacbca1ecfa6d6bd981da5bfc507eba084187a9e389399daa51c46bc5f999f',
});
var contractExt = tronWebExternal.contract(abi, contractAddress);
var upgradeLevels = [ 50000, 100000, 300000, 1000000, 10000000 ];
var nextUpgradePrice = 0;

function loadDivs() {
  if (!myAddress) {
    return;
  }
  
  $.get('/?divs=' + myAddress, function(res) {
    res = JSON.parse(res);
    $('#mydivs').html(res.map(function(r) { return '<div class="float-left">' + r.date + ' <a target="_blank" href="https://tronscan.org/#/transaction/' + r.hash + '">TronScan</a></div><div class="float-right mono">' + r.amount + ' ' + r.token + '</div><div class="clearfix"></div>'; }).join(''));
  });
}

function loadRefs() {
  if (!myAddress) {
    return;
  }
  
  $.get('/?refs=' + myAddress, function(res) {
    res = JSON.parse(res);
    $('#myrefs').html(res.map(function(r) { return '<div class="float-left">' + r.user.slice(0, 8) + '... <a target="_blank" href="https://tronscan.org/#/address/' + r.user + '">TronScan</a></div><div class="float-right mono">' + (r.invested / 20) + ' TRX</div><div class="clearfix"></div>'; }).join(''));
  });
}

$('.showDivsHistory').click(function() {
  loadDivs();
  $('#divsHistoryModal').modal();
});

$('.showRefs').click(function() {
  loadRefs();
  $('#refsModal').modal();
});

window.setInterval(function() {
  tronWebExternal.trx.getCurrentBlock(function(err, res) {
    blockNumber = res.block_header.raw_data.number;
    
    if (blockNumber === prevGameStartIn) {
      return
    }
    
    prevGameStartIn = blockNumber;
    
    var diff = (blockNumber - 18318500) * 3 >> 0;
    if (diff > 0) {
      $('.gameRun').show();
      $('.gameWait').hide();
      gameStarted = true;
    } else {
      $('.gameRun').hide();
      $('.gameWait').show();
      gameStarted = false;
    }
    
    gameStartIn = Math.abs(diff);
  });
  
  contractExt.totalInvestors().call().then(function(res) {
    $('.totalInvestors').html(res.toString());
  });
  
  contractExt.totalInvested().call().then(function(res) {
    totalInvested = res.toNumber();
    var totalString = tronWebExternal.fromSun(res.toString());
    $('#trxInvested').html(totalString);
    
    if (totalInvested) {
      for (var i = 0; i < 7; i++) {
        $('#num' + i).html(totalString[totalString.length - i - 1] || '&nbsp;');
      }
    } else {
      for (var i = 0; i < 7; i++) {
        $('#num' + i).html('0');
      }
    }
    
    $('.divPool').html(tronWebExternal.fromSun(totalInvested / 40 - totalPaid) >> 0);
  });
  
  contractExt.prizeFund().call().then(function(res) {
    $('.getPrizeFund').html('Collect Prize (' + (tronWebExternal.fromSun(res.toString()) / 2) + ' TRX)');
  });
  
  contractExt.lastInvestor().call().then(function(res) {
    res = tronWebExternal.address.fromHex(res);
    $('#lastInvestor').html(res === myAddress ? '<span class="text-info">YOU</span>' : res);
  });
  
  contractExt.lastInvestedAt().call().then(function(res) {
    if (res.toNumber() === prevLastInvestedAtBlock) {
      return
    }
    
    prevLastInvestedAtBlock = res.toNumber();
    
    lastInvestedAt = (blockNumber - res.toNumber()) * 3;
    if (lastInvestedAt < 0) {
      lastInvestedAt = 0;
    }
  });
  
  contractExt.totalFrozen().call().then(function(res) {
    totalFrozenAmount = res.toNumber();
    $('.frozenTotalAmount').html((totalFrozenAmount / 1000000).toFixed(2));
  });
  
  if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
    myAddress = window.tronWeb.defaultAddress.base58;
    
    $('#node').val('https://keys3d.arcadium.network/?node=' + myAddress);
    
    $('.privateData').show();
    
          contractExt.objects(myAddress, 50000000).call().then(function(res) {
        $('.class8-builds').html(res.toString());
      });
          contractExt.objects(myAddress, 100000000).call().then(function(res) {
        $('.class7-builds').html(res.toString());
      });
          contractExt.objects(myAddress, 200000000).call().then(function(res) {
        $('.class6-builds').html(res.toString());
      });
          contractExt.objects(myAddress, 500000000).call().then(function(res) {
        $('.class5-builds').html(res.toString());
      });
          contractExt.objects(myAddress, 1000000000).call().then(function(res) {
        $('.class4-builds').html(res.toString());
      });
          contractExt.objects(myAddress, 5000000000).call().then(function(res) {
        $('.class3-builds').html(res.toString());
      });
          contractExt.objects(myAddress, 10000000000).call().then(function(res) {
        $('.class2-builds').html(res.toString());
      });
          contractExt.objects(myAddress, 100000000000).call().then(function(res) {
        $('.class1-builds').html(res.toString());
      });
        
    contractExt.getAllProfitAmount(myAddress).call().then(function(res) {
      $('#getProfit').html('Collect Profit (' + (res.toString() === '0' ? '' : (res.toString() / 1000000).toFixed(6) + ' TRX)'));
      if (res.toString() === '0') {
        $('#getProfit').addClass('disabled');
      } else {
        $('#getProfit').removeClass('disabled');
      }
    });
    
    contractExt.allowGetPrizeFund(myAddress).call().then(function(res) {
      if (res) {
        $('.getPrizeFund').removeClass('disabled');
      } else {
        $('.getPrizeFund').addClass('disabled');
      }
    });
    
    contractExt.registered(myAddress).call().then(function(res) {
      if (res) {
        $('.noref').hide();
        $('.withref').show();
      } else {
        $('.noref').show();
        $('.withref').hide();
      }
    });
    
    contractExt.frozen(myAddress).call().then(function(res) {
      $('.frozenAmount').html((res.toNumber() / 1000000).toFixed(2));
      if (totalFrozenAmount > 0) {
        $('.divsAmount').html((res.toNumber() * (totalInvested / 40 - totalPaid) / totalFrozenAmount / 1000000 / 16).toFixed(4));
        // $('.divsAmountTWX').html((res.toNumber() * (totalInvested / 40 - totalPaid) / totalFrozenAmount / 1000000 / twxRate).toFixed(4));
      }
    });
    
    contractExt.upgrades(myAddress).call().then(function(res) {
      if (!upgradeLevels[res.toNumber()]) {
        $('.upgrade').hide();
        $('.upgrades').html(res.toString());
        nextUpgradePrice = 0;
      } else {
        $('.upgrade').show();
        $('.upgrade').html('Upgrade (' + upgradeLevels[res.toNumber()] + ' ATRC)');
        $('.upgrades').html(res.toString());
        nextUpgradePrice = upgradeLevels[res.toNumber()];
      }
    });
    
    tronWeb.trx.getUnconfirmedAccount(myAddress)
      .then(function(res) {
        var xio10Asset = res.assetV2 && R.find(R.propEq('key', '1002937'))(res.assetV2);
        $('.tokenAmount').html(xio10Asset && (xio10Asset.value / 1000000).toFixed(2) || '0.00');
      });
  } else {
    $('.privateData').hide();
  }
}, 1000);

$('.buyBuilding').click(function() {
  if (!gameStarted) {
    $('#tronlinkModalContent').html('The game has not started yet! However, you can already invite referrals to the game!');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb.defaultAddress.base58) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  
  var contract = window.tronWeb.contract(abi, contractAddress);
  
  contract.buy('TUX8V8YwpAVk8BHcXeVLgHGb2DC7UQxfEU').send({
    shouldPollResponse: false,
    callValue: $(this).data('buy') * 1000000,
    feeLimit: FEE_LIMIT
  })
    .then(function() {
      
    })
    .catch(function() {
      alert('Not enough funds');
    });
});

$('#getProfit').click(function() {
  if (!gameStarted) {
    $('#tronlinkModalContent').html('The game has not started yet! However, you can already invite referrals to the game!');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb.defaultAddress.base58) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  
  if ($(this).hasClass('disabled')) {
    return;
  }
  
  var contract = window.tronWeb.contract(abi, contractAddress);
  
  contract.getProfit().send({
    shouldPollResponse: false,
    callValue: 0,
    feeLimit: FEE_LIMIT
  })
    .then(function() {
      
    });
});

$('.upgrade').click(function() {
  if (nextUpgradePrice) {
    var contract = window.tronWeb.contract(abi, contractAddress);
    
    contract.upgrade('TUX8V8YwpAVk8BHcXeVLgHGb2DC7UQxfEU').send({
      shouldPollResponse: false,
      tokenValue: nextUpgradePrice * 1000000,
      tokenId: 1002937,
      feeLimit: FEE_LIMIT
    })
      .then(function() {
        
      })
      .catch(function(e) {
        alert(e.message);
      });
  }
});

$('.getPrizeFund').click(function() {
  if (!gameStarted) {
    $('#tronlinkModalContent').html('The game has not started yet! However, you can already invite referrals to the game!');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb.defaultAddress.base58) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  
  if ($(this).hasClass('disabled')) {
    return;
  }
  
  var contract = window.tronWeb.contract(abi, contractAddress);
  
  contract.getPrizeFund().send({
    shouldPollResponse: false,
    callValue: 0,
    feeLimit: FEE_LIMIT
  })
    .then(function() {
      
    });
});

$('.register').click(function() {
  if (!window.tronWeb) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb.defaultAddress.base58) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  
  if ($(this).hasClass('disabled')) {
    return;
  }
  
  var contract = window.tronWeb.contract(abi, contractAddress);
  
  contract.register('TUX8V8YwpAVk8BHcXeVLgHGb2DC7UQxfEU').send({
    shouldPollResponse: false,
    callValue: 0,
    feeLimit: FEE_LIMIT
  })
    .then(function() {
      
    });
});

$('#freeze').click(function() {
  if (!window.tronWeb) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb.defaultAddress.base58) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  
  if ($(this).hasClass('disabled')) {
    return;
  }
  
  var contract = window.tronWeb.contract(abi, contractAddress);
  
  contract.freeze('TUX8V8YwpAVk8BHcXeVLgHGb2DC7UQxfEU').send({
    shouldPollResponse: false,
    tokenValue: ($('#freezeAmount').val() * 1000000).toFixed(0),
    tokenId: 1002937,
    feeLimit: FEE_LIMIT
  })
    .then(function() {
      
    });
});

$('#unfreeze').click(function() {
  if (!window.tronWeb) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  if (!window.tronWeb.defaultAddress.base58) {
    $('#tronlinkModalContent').html('Please, install TronLink / TronPay and authorize.');
    $('#tronlinkModal').modal();
    return;
  }
  
  if ($(this).hasClass('disabled')) {
    return;
  }
  
  var contract = window.tronWeb.contract(abi, contractAddress);
  
  contract.unfreeze().send({
    shouldPollResponse: false,
    callValue: 0,
    feeLimit: FEE_LIMIT
  })
    .then(function() {
      
    });
});

window.setInterval(function() {
  var diff = Date.now() / 1000 - 1561486273 >> 0;
  var dd = diff / 86400 >> 0;
  var hh = (diff - dd * 86400) / 3600 >> 0;
  var mm = (diff - dd * 86400 - hh * 3600) / 60 >> 0;
  var ss = diff - dd * 86400 - hh * 3600 - mm * 60;
  
  dd = dd < 10 ? '0' + dd : dd;
  hh = hh < 10 ? '0' + hh : hh;
  mm = mm < 10 ? '0' + mm : mm;
  ss = ss < 10 ? '0' + ss : ss;
  
  $('#timeFromStart').html(dd + ' ' + hh + ':' + mm + ':' + ss);
  
  var dd = lastInvestedAt / 86400 >> 0;
  var hh = (lastInvestedAt - dd * 86400) / 3600 >> 0;
  var mm = (lastInvestedAt - dd * 86400 - hh * 3600) / 60 >> 0;
  var ss = lastInvestedAt - dd * 86400 - hh * 3600 - mm * 60;
  
  dd = dd < 10 ? '0' + dd : dd;
  hh = hh < 10 ? '0' + hh : hh;
  mm = mm < 10 ? '0' + mm : mm;
  ss = ss < 10 ? '0' + ss : ss;
  
  $('#lastInvestmentAt').html(dd + ' ' + hh + ':' + mm + ':' + ss);
  
  lastInvestedAt++;
  
  var dd = gameStartIn / 86400 >> 0;
  var hh = (gameStartIn - dd * 86400) / 3600 >> 0;
  var mm = (gameStartIn - dd * 86400 - hh * 3600) / 60 >> 0;
  var ss = gameStartIn - dd * 86400 - hh * 3600 - mm * 60;
  
  dd = dd < 10 ? '0' + dd : dd;
  hh = hh < 10 ? '0' + hh : hh;
  mm = mm < 10 ? '0' + mm : mm;
  ss = ss < 10 ? '0' + ss : ss;
  
  $('.gameStartIn').html(dd + ' ' + hh + ':' + mm + ':' + ss);
  
  gameStartIn += gameStarted ? 1 : -1;
  if (gameStartIn < 0) {
    gameStartIn = 0;
  }
  
  divsCounter--;
  if (divsCounter < 0) {
    divsCounter += 86400;
  }
  
  if (gameStarted) {
    var dd = divsCounter / 86400 >> 0;
    var hh = (divsCounter - dd * 86400) / 3600 >> 0;
    var mm = (divsCounter - dd * 86400 - hh * 3600) / 60 >> 0;
    var ss = divsCounter - dd * 86400 - hh * 3600 - mm * 60;
    
    dd = dd < 10 ? '0' + dd : dd;
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    ss = ss < 10 ? '0' + ss : ss;
    
    $('.divsCounter').html(dd + ' ' + hh + ':' + mm + ':' + ss);
  } else {
    $('.divsCounter').html('-- --:--:--');
  }
}, 1000);